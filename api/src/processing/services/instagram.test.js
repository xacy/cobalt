import assert from "node:assert/strict";
import test from "node:test";

import { env } from "../../config.js";
import matchAction from "../match-action.js";
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

test("proxies the native Instagram audio track when available", () => {
    env.apiURL = "http://localhost:9000";
    const result = matchAction({
        r: {
            urls: ["https://cdn.example/video-dash.mp4", "https://cdn.example/audio-dash.m4a"],
            audioSource: "https://cdn.example/audio-dash.m4a",
            bestAudio: "m4a",
            audioFilename: "instagram_test_audio",
            sourceMetadata: {
                description: "Ingredientes: 200 g de harina",
                author: "@cocina",
                thumbnail: "https://cdn.example/cover.jpg",
            },
        },
        host: "instagram",
        audioFormat: "best",
        isAudioOnly: true,
        isAudioMuted: false,
        disableMetadata: true,
        filenameStyle: "basic",
        convertGif: false,
        requestIP: "127.0.0.1",
        audioBitrate: "64",
        alwaysProxy: false,
        localProcessing: "forced",
    });

    assert.equal(result.body.status, "local-processing");
    assert.equal(result.body.type, "proxy");
    assert.equal(result.body.output.filename, "instagram_test_audio.m4a");
    assert.deepEqual(result.body.metadata, {
        description: "Ingredientes: 200 g de harina",
        author: "@cocina",
        thumbnail: "https://cdn.example/cover.jpg",
    });
});
