import assert from "node:assert/strict";
import test from "node:test";

import { extractDashUrls } from "./instagram.js";

test("extracts the highest-bandwidth Instagram DASH video and audio streams", () => {
    const manifest = `<MPD><Period>
        <AdaptationSet contentType="video">
            <Representation bandwidth="100"><BaseURL>https://cdn.example/low.mp4?a=1&amp;b=2</BaseURL></Representation>
            <Representation bandwidth="200"><BaseURL>https://cdn.example/high.mp4</BaseURL></Representation>
        </AdaptationSet>
        <AdaptationSet mimeType="audio/mp4">
            <Representation bandwidth="64"><BaseURL>https://cdn.example/audio.m4a?a=1&amp;b=2</BaseURL></Representation>
        </AdaptationSet>
    </Period></MPD>`;

    assert.deepEqual(extractDashUrls(manifest), [
        "https://cdn.example/high.mp4",
        "https://cdn.example/audio.m4a?a=1&b=2",
    ]);
});

test("does not replace the progressive URL when DASH audio is missing", () => {
    const manifest = `<MPD><Period><AdaptationSet contentType="video">
        <Representation bandwidth="200"><BaseURL>https://cdn.example/video.mp4</BaseURL></Representation>
    </AdaptationSet></Period></MPD>`;

    assert.equal(extractDashUrls(manifest), undefined);
});
