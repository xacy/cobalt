import assert from 'node:assert/strict';
import test from 'node:test';

import { getBranch, getCommit, getRemote } from './index.js';

test('uses Render metadata when the Git directory is unavailable', async () => {
    process.env.RENDER_GIT_BRANCH = 'main';
    process.env.RENDER_GIT_COMMIT = '60da1caf';
    process.env.RENDER_GIT_REPO_SLUG = 'xacy/cobalt';

    assert.equal(await getBranch(), 'main');
    assert.equal(await getCommit(), '60da1caf');
    assert.equal(await getRemote(), 'xacy/cobalt');
});
