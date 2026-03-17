import Elysia from 'elysia';

export const errorPlugin = new Elysia()
.onError({as:'global'},({ error, status }) => {
    status(400);
    return {
        error: true,
        message: error,
    };
});
