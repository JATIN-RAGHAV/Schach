import authPlugin from "./plugins/authPlugin";

authPlugin.get("/me", async ({ user }) => {
    return {
        username: user.username,
        userId: user.userId,
    };
})
