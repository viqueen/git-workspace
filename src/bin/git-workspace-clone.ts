#! /usr/bin/env node

/**
 * Copyright 2023 Hasnae Rehioui
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { withCliProgress } from '@labset/task-pool-executor';

import { getConfiguration, itemFilter, WithProgram, withProgram } from '../lib';
import { cloneItemTask } from '../tasks';

const cloneRepos: WithProgram = ({ registry, workspacesRoot }, program) => {
    program.description('clone workspace repos').action(async (opts) => {
        const { workspace, namespace, host, slug, keyword } = opts;
        await registry
            .list(itemFilter({ workspace, namespace, host, slug, keyword }))
            .then((items) => {
                return withCliProgress((taskPool) => {
                    items
                        .map(cloneItemTask({ workspacesRoot }))
                        .forEach((t) => t && taskPool.submit(t));
                });
            });
    });
};

getConfiguration().then(withProgram(cloneRepos)).catch(console.error);
