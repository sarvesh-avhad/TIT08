const PRIORITY_WEIGHTS = {
    Placement: 3,
    Result: 2,
    Event: 1
};

const notifications = [
    {
        ID: "1",
        Type: "Placement",
        Message: "Google hiring drive",
        Timestamp: "2026-05-18 17:51:30"
    },
    {
        ID: "2",
        Type: "Result",
        Message: "Mid sem result published",
        Timestamp: "2026-05-18 17:45:00"
    },
    {
        ID: "3",
        Type: "Event",
        Message: "Tech fest announcement",
        Timestamp: "2026-05-18 17:40:00"
    },
    {
        ID: "4",
        Type: "Placement",
        Message: "Amazon hiring drive",
        Timestamp: "2026-05-18 17:35:00"
    },
    {
        ID: "5",
        Type: "Result",
        Message: "Project review results",
        Timestamp: "2026-05-18 17:30:00"
    }
];

function calculatePriority(notification) {

    const typeWeight =
        PRIORITY_WEIGHTS[notification.Type] || 0;

    const notificationTime =
        new Date(notification.Timestamp).getTime();

    const currentTime = Date.now();

    const minutesOld =
        (currentTime - notificationTime) / (1000 * 60);

    const recencyScore =
        Math.max(1000 - minutesOld, 0);

    return (typeWeight * 1000) + recencyScore;
}

async function getTopNotifications(limit = 10) {

    const prioritizedNotifications =
        notifications.map(notification => ({
            ...notification,
            priorityScore:
                calculatePriority(notification)
        }));

    prioritizedNotifications.sort(
        (a, b) =>
            b.priorityScore - a.priorityScore
    );

    return prioritizedNotifications.slice(0, limit);
}

module.exports = {
    getTopNotifications
};