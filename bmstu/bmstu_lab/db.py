import MySQLdb

db = MySQLdb.connect(
    host="localhost",
    user="dbuser",
    passwd="123",
    db="first_db"
)

c=db.cursor()
c.execute("INSERT INTO posts (username, descript) VALUES (%s, %s);", ('Book', 'Description'))
db.commit()
c.close()
db.close()