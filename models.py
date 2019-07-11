from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SECRET_KEY'] = '1234567890'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:root@localhost/ams'
db = SQLAlchemy(app)


class FacultyDetails(db.Model):
    __tablename__ = 'faculty_details'
    email = db.Column(db.String(50), nullable=False, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    facultyCode = db.Column('faculty_code', db.String(20), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    findMeAt = db.Column('find_me_at', db.String(70))


class FacultyAuth(db.Model):
    __tablename__ = 'faculty_auth'
    email = db.Column(db.String(50), db.ForeignKey(
        'faculty_details.email'), primary_key=True)
    password = db.Column(db.String(100), nullable=False)


class CourseDetails(db.Model):
    __tablename__ = 'course_details'
    courseId = db.Column('id', db.Integer, primary_key=True)
    courseCode = db.Column('course_code', db.String(20))
    courseName = db.Column('course_name', db.String(50), nullable=False)
    theoryCredits = db.Column('theory_credit', db.Integer, nullable=False)
    labCredits = db.Column('lab_credit', db.Integer, nullable=False)
    courseSemester = db.Column('course_semester', db.Integer, nullable=False)


class FacultyCourse(db.Model):
    __tablename__ = 'faculty_course'
    id = db.Column('id', db.Integer, primary_key=True)
    facultyEmail = db.Column('faculty_email',
                             db.ForeignKey('faculty_details.email'))
    courseId = db.Column('course_id',
                         db.ForeignKey('course_details.id'))


class StudentDetails(db.Model):
    __tablename__ = 'student_details'
    enrollNumber = db.Column('enroll_number', db.String(20), primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    programme = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False)


class StudentCourse(db.Model):
    __tablename__ = 'student_course'
    id = db.Column('id', db.Integer, primary_key=True)
    studentEnroll = db.Column('student_enroll',
                              db.ForeignKey('student_details.enroll_number'))
    courseId = db.Column('course_id',
                         db.ForeignKey('course_details.id'))
    section = db.Column(db.String(5), nullable=False)


class Attendance(db.Model):
    __tablename__ = 'attendance_table'
    studentEnroll = db.Column('student_enroll',
                              db.ForeignKey('student_details.enroll_number'), primary_key=True)
    courseId = db.Column('course_id',
                         db.ForeignKey('course_details.id'), primary_key=True)
    facultyCode = db.Column('faculty_code', nullable=False)
    date = db.Column(db.DateTime, nullable=False, primary_key=True)
    status = db.Column(db.Integer, default=0, nullable=False)


if __name__ == '__main__':
    app.run(debug=True)
