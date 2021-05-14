
jest.mock('@App/helpers/serverFireAction', () => {
    return {
        serverFireAction: () => null,
    }
});

jest.mock('winston', () => {
    class Console { }
    class File { }
    return {
        format: {
            printf: () => ({}),
            timestamp: () => ({}),
            combine: () => ({}),
        },
        transports: {
            File: File,
            Console: Console,
        },
        createLogger: () => {
            return {
                log: () => null,
                info: () => null,
                warn: () => null,
                error: () => null,
            }
        },
    }
});

import { getServerTempDir } from '@cromwell/core-backend';
import { join } from 'path';
import fs from 'fs-extra';

const testDir = join(getServerTempDir(), 'test');
if (fs.pathExistsSync(testDir)) fs.removeSync(testDir);