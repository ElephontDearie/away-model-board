
export const grantAdminRightsOnRegister = async (userUuid: string) => {

    return await fetch(`/api/users/${userUuid}`, {
        method: 'PUT',
        body: JSON.stringify({
            id: userUuid
        })
    });
}