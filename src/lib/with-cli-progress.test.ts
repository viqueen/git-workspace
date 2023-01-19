import { CliProgressRunContext, taskPoolExecutor } from 'task-pool-executor';
import { withCliProgress } from './with-cli-progress';

jest.mock('task-pool-executor', () => {
    return {
        ...jest.requireActual('task-pool-executor'),
        cliProgressTaskPoolExecutor: jest.fn(() => {
            return taskPoolExecutor<string, CliProgressRunContext>();
        })
    };
});

const task = jest.fn();

const delayedTask = (millis: number, title: string) => {
    const run = (_ctx?: CliProgressRunContext) =>
        new Promise<string>((resolve) => {
            setTimeout(() => {
                task();
                resolve('done');
            }, millis);
        });
    return { title, run };
};

describe('with-cli-progress', () => {
    it('should clear when tasks are done', async () => {
        await withCliProgress((taskPool) => {
            new Array(10)
                .fill(0)
                .map((_v, index) => delayedTask(2000, `task ${index}`))
                .forEach((t) => taskPool.submit(t));
        });
        expect(task).toBeCalledTimes(10);
    });
});
