from flask import Flask, jsonify, request, json
from flask_mysqldb import MySQL
from datetime import datetime
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)

from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
# app.config['MYSQL_USER'] = 'sql12287757'
# app.config['MYSQL_PASSWORD'] = 'kn9mmT2GVN'
# app.config['MYSQL_DB'] = 'sql12287757'
# # # app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
# # app.config['JWT_SECRET_KEY'] = 'secret'
# app.config['MYSQL_PORT'] = 3306
# app.config['MYSQL_HOST'] = 'sql12.freemysqlhosting.net'


app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'ams'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
# app.config['JWT_SECRET_KEY'] = 'secret'
# app.config['MYSQL_PORT'] = 5000
app.config['MYSQL_HOST'] = 'localhost'

mysql = MySQL(app)
bcrypt = Bcrypt(app)

@app.route("/",methods = ['POST'])
def check():

    cur       =     mysql.connection.cursor()
    name      =     request.get_json(force = True)['first_name']
    email     =     request.get_json(force =True)['email']
    phone     =     request.get_json(force = True)['phone']
    address   =     request.get_json(force = True)['address']
    fac_id    =     request.get_json(force = True)['fac_id']
    #password  =     bcrypt.generate_password_hash(request.get_json(force = True  )['password']).decode('utf-8')


    cur       =     mysql.connection.cursor()
    key       =     "'"+str(fac_id)+"'"
    query     =     "SELECT count(*) from faculty_tab where fac_id = "+ key+';'


    print(query)


    cur.execute(query)

    rv = cur.fetchall()

    cur.close()

    checkKey = rv[0]['count(*)']

    requestCode=200

    if checkKey == 1:
        requestCode = 400
    
    return jsonify({"requestcode":requestCode})
    checkKey = rv[0]['count(*)']

@app.route('/test')
def test():
    return 'Hello World !!'



@app.route('/login',methods = ['GET','POST'])
def login():

    username  =  request.get_json(force=True)['fac_id']
    password  =  request.get_json()['password']

    queryPassword = "'"+str(password)+"'"
    queryusername = "'"+str(username)+"'"

    query = "Select * from faculty_tab where fac_id = " + queryusername+";"

    cur = mysql.connection.cursor()

    cur.execute(query)

    rv = cur.fetchone()

    cur.close()


    returnCode = 200
    if bcrypt.check_password_hash(rv['password'],password):
        return jsonify({"returnCode":returnCode})

    returnCode = 400

    return jsonify({"returnCode":returnCode})




@app.route('/dashboard', methods = ['POST'])
def dashboard():

    fac_id = request.get_json(force = True)['fac_id']

    queryid = "'"+fac_id+"'"
    query = 'Select * from course_tab natural join faculty_course_tab where faculty_id = ' + queryid +";"

    cur = mysql.connection.cursor()

    cur.execute(query)

    rv = cur.fetchall()

    if not rv:
        return jsonify({"requestCode":400})

    cur.close()

    return jsonify(rv)


# @app.route('/addcourse',methods = ['GET','POST'])
# def registerCourse():

#     if request.method == 'POST':
#         course_id           =   request.get_json()['course_id']
#         course_code         =   request.get_json()['course_code']
#         course_name         =   request.get_json()['course_name']
#         theory_credit       =   request.get_json()['theory_credit']
#         lab_credit          =   request.get_json()['lab_credit']
#         course_sem          =   request.get_json()['course_sem']
#         course_programme    =   request.get_json()['course_prog']
#         students_enrolled   =   request.get_json()['total_students']

#         qid            =   "'"+str(course_id)+"'"
#         qcode          =   "'"+str(course_code)+"'"
#         qname          =   "'"+str(course_name)+"'"
#         qtcredit       =   int(theory_credit)
#         qlcredit       =   int(lab_credit)
#         qsem           =   int(course_sem)
#         qprog          =   "'"+str(course_programme)+"'"
#         qtot           =   int(students_enrolled)

#         query = "INSERT into course_tab values ("+qid+","+qcode+","+qname+","+str(qtcredit)+","+str(qlcredit)+","+str(qsem)+","+qprog+","+str(qtot+");"

#         return jsonify({"query":query})
    
#     return "dashboard"





	
if __name__ == '__main__':

    app.run(debug=True)