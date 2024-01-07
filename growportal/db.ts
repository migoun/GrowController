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
                resolve(rows);
            }
        });
        
        db.close();
    });
}
