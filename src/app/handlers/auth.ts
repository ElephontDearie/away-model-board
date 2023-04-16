// Make a user account admin by providing the user UUID form Firebase.
export const grantAdminRightsOnRegister = async (userUuid: string) => {
    return await fetch(`/api/users/${userUuid}`, {
        method: 'PUT',
        body: JSON.stringify({
            id: userUuid
        })
    });
}