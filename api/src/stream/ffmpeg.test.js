import assert from "node:assert/strict";
import test from "node:test";

import { ffmpegFailure } from "./ffmpeg.js";

test("reports an upstream HTTP failure without exposing its URL", () => {
    const stderr = "https://signed.example/media: Server returned 403 Forbidden\n";
    assert.equal(ffmpegFailure(stderr, 1, null), "Server returned 403 Forbidden");
});

test("reports the FFmpeg exit signal when stderr has no useful reason", () => {
    assert.equal(ffmpegFailure("", null, "SIGKILL"), "FFmpeg exited with signal SIGKILL");
});

test("reports FFmpeg details without exposing signed URLs", () => {
    const stderr = "https://signed.example/media?token=secret: Invalid data found when processing input\n";
    assert.equal(
        ffmpegFailure(stderr, 234, null),
        "[url] Invalid data found when processing input",
    );
});

test("reports the FFmpeg exit code when stderr has no useful reason", () => {
    assert.equal(ffmpegFailure("", 1, null), "FFmpeg exited with code 1");
});
