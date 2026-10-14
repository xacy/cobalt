import assert from "node:assert/strict";
import test from "node:test";

import { ffmpegFailure } from "./ffmpeg.js";

test("reports an upstream HTTP failure without exposing its URL", () => {
    const stderr = "https://signed.example/media: Server returned 403 Forbidden\n";
    assert.equal(ffmpegFailure(stderr), "Server returned 403 Forbidden");
});

test("uses a generic failure when FFmpeg provides no useful reason", () => {
    assert.equal(ffmpegFailure(""), "FFmpeg produced no output");
});
