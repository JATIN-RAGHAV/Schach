import Elysia from 'elysia';

export const errorPlugin = new Elysia()
.onError({as:'global'},({ set }) => {
    set.status = 400;
    return {
        error: true,
        message: "Some thing broke, shit",
    };
});
