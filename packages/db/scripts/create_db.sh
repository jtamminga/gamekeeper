# bash create_db.sh
rm gamekeeper.db
cat create.sql | sqlite3 gamekeeper.db