export const DB = new Dexie('hogetyping');
DB.version(2).stores({
    result: '++id,date,mode,cpm,raw,mis,acc,miss_data'
}).upgrade(tx => {
    const thresholdDate = new Date('2025-09-23T12:23:00.000Z'); // GMT+9を考慮したUTC時間

    return tx.result
        .where('date').above(thresholdDate)
        .modify(result => {
            result.miss_data = {};
        });
});
DB.version(1).stores({
    result: '++id,date,mode,cpm,raw,mis,acc,miss_data'
});