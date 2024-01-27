import sqlite3 from 'sqlite3';

export function getData(): Promise<any>
{
    return new Promise<any>((resolve, reject) => {              
        const db: sqlite3.Database = new sqlite3.Database('growcontrol.db');
        let result = {};

        db.all('SELECT * FROM measurement_history', (err, rows) => {
            if (err) {
                reject({ error: err.message });
            } else {
                // return all db entries, but increase hour by 1. Because it seems like UTC in the database
                resolve(rows.map(function(e: any) {
                    // Create a Date object from the timestamp string
                    let originalTimestamp = new Date(e.timestamp);
                    // Add one hour to the Date object
                    originalTimestamp.setHours(originalTimestamp.getHours() + 2);
                    // Format the new Date object to the desired string format
                    e.timestamp = originalTimestamp.toISOString().slice(0, 19).replace("T", " ");
                    return e;
                }));
            }
        });
        
        db.close();
    });
}
