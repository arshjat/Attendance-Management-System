from flask import Flask, jsonify, request, json
from flask_mysqldb import MySQL
from datetime import datetime
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text


app = Flask(__name__)

app.config['SECRET_KEY'] = '123456789'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:root@localhost/ams'
db = SQLAlchemy(app)
mysql = MySQL(app)
bcrypt = Bcrypt(app)


@app.route('/register', methods=['GET', 'POST'])
def register():

    if request.method == 'POST':

        name = request.get_json(force=True)['name']
        email = request.get_json(force=True)['email']
        phone = request.get_json(force=True)['phone']
        address = request.get_json(force=True)['findMeAt']
        facultyCode = request.get_json(force=True)['facultyCode']
        password = bcrypt.generate_password_hash(
            request.get_json(force=True)['password']).decode('utf-8')

        query = text(
            "SELECT count(*) from faculty_auth where email = '" + str(email) + "';")

        result = db.engine.execute(query)

        row = result.fetchone()

        statusCode = 201
        if row[0] != 0:
            return statusJson(statusCode, "User already registered")

        query = "Insert into faculty_details(email,name,faculty_code,phone,find_me_at) values ("+"'" + \
            email+"'"+","+"'"+name+"'"+","+"'"+facultyCode + \
                "'"+","+"'"+phone+"'"+","+"'"+address+"'"+");"
        result = db.engine.execute(text(query))

        query = "Select id from faculty_details where email = '" + \
            str(email)+"';"

        result = db.engine.execute(text(query))

        row = result.fetchall()

        query = "Insert into faculty_auth values("+str(
            row[0][0])+",'"+str(email)+"',"+"'"+str(password)+"'"+");"

        result = db.engine.execute(text(query))

        # sprint(query)

        return statusJson(200, "Registeration Successfull")


@app.route('/register/available', methods=['GET', 'POST'])
def checkEmailAvailability():

    if request.method == 'POST':

        email = request.get_json(force=True)['email']
        password = bcrypt.generate_password_hash(
            request.get_json(force=True)['password']).decode('utf-8')

        query = text(
            "SELECT email from faculty_auth where email = '" + str(email) + "';")
        result = db.engine.execute(query)
        row = result.fetchone()

        if str(row) == 'None':
            return statusJson(200, "Email Available")
        else:
            return statusJson(201, 'Email Already Registered')


@app.route('/login', methods=['POST'])
def login():

    if request.method == 'POST':

        email = request.get_json(force=True)['email']
        password = request.get_json(force=True)['password']

        queryEmail = "'"+str(email)+"'"
        query = "select password from faculty_auth where email ="+queryEmail+";"
        result = db.engine.execute(text(query))
        row = result.fetchall()

        if not row:
            return statusJson(202, "User Not Registered")

        if bcrypt.check_password_hash(row[0][0], str(password)):
            query = "select * from faculty_details where email ="+queryEmail+";"
            result = db.engine.execute(text(query))
            row = result.fetchone()

            return jsonifyFaculty(row)
        else:
            statusCode = 201
            return statusJson(statusCode, "Incorrect Password")


@app.route('/dashboard', methods=['GET', 'POST'])
def dashboard():

    email = request.get_json(force=True)['email']

    # Pehle query than join karne se query optimizw kr skte hai
    query = "select * from course_details inner join faculty_course on course_details.id = faculty_course.course_id where faculty_course.email ="\
        + str(email)+";"

    result = db.engine.execute(text(query))

    row = result.fetchall()

    courses = []
    for courseDetails in row:
        courses.append(dict(courseDetails))

    return json.dumps(courses)


@app.route('/dashboard/registerCourse', methods=['POST'])
def addCourse():

    courseId = request.get_json(force=True)["courseId"]
    facultyId = request.get_json(force=True)["facultyId"]

    query = "Select course_id from faculty_course where faculty_id = " + \
        str(facultyId)+" and course_id = "+str(courseId)+";"
    result = db.engine.execute(text(query))
    row = result.fetchall()

    if row:
        return statusJson(201, "Faculty has already registered for the Course")

    else:
        query = "Insert into faculty_course values(" + \
            str(facultyId)+","+str(courseId)+");"
        db.engine.execute(text(query))

        return statusJson(200, "Succesfully Registered")


# @app.route('/dashboard/takeAttendace', methods = ['POST'])
# def takeAttendance():


@app.route('/dashboard/takeAttendance', methods=['POST'])
def takeAttendance():
    courseId = request.get_json()["courseId"]
    sectionId = request.get_json()["sectionId"]

    query = "select enroll_number,id,name,programme from student_details inner join student_course on student_details.id = student_course.student_id where course_id = " + str(courseId)+" and section = '"\
        + str(sectionId)+"';"
    result = db.engine.execute(query)
    row = result.fetchall()
    students = []
    for student in row:
        students.append(dict(student))
    return jsonify(students)


def statusJson(statusCode, message):
    return jsonify({"statusCode": statusCode,
                    "message": message})


def jsonifyFaculty(row):
    return jsonify({"id": row[0], "email": row[1], "name": row[2],
                   "facultyCode": row[3], "phone": row[4], "findMeAt": row[5]})


if __name__ == '__main__':
    app.run(debug=True)
