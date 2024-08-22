
const MemberStatus = {
    INVITED: "INVITED",
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    INACTIVE: "INACTIVE",
    BANNED: "BANNED",
    REMOVED: "REMOVED"
}

const memberStatuses = Object.values(MemberStatus);

export const getMemberStatusByIndex = (index) => {
    return memberStatuses[index]
}