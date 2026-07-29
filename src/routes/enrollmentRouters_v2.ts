import { Router, type Request, type Response } from "express";
import {
  zCourseId,
  zCoursePostBody,
  zCoursePutBody,
  zEnrollmentBody,
  zVerificationBody,
  zEnrollmentEditBody
} from "../libs/zodValidators.ts";

import type { Student, Course, Enrollment } from "../libs/types.ts";

// import database
import { students } from "../db/db.ts";
import { courses } from "../db/db.ts";
import { enrollments } from "../db/db.ts";
import { parse } from "path";
import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { ZodParsedType } from "zod/v3";

const router = Router();
const jwt_secret = process.env.JWT_SECRET || "hg8g3kfh8qgeivfg8";

// GET /api/v2/enrollments
router.get("/", (req: Request, res: Response) => {
  //try {
    const courseNo = req.query.courseNo;
    const studentId = req.query.studentId;
    const token = req.query.token;
    const parseResult = zEnrollmentBody.safeParse({courseNo,studentId});
    const VerificationParseResult = zVerificationBody.safeParse({token});

    if (!(parseResult.success || VerificationParseResult)) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parseResult.error.issues[0]?.message,
      });
    }
    interface reqData{role : string, studentId : string}
    const reqData = jwt.verify(req.body.token,jwt_secret) as reqData;

    if(reqData.role === 'ADMIN'){
    //logic
    if(studentId === undefined && courseNo === undefined){
        return res.status(200).json({
          success: true,
          data: enrollments,
    });
    } else if(studentId === undefined){
    let studentFound = students.filter(
      (c: Student) => c.courses?.includes(String(courseNo))
    ); 

    if (!studentFound) {
      return res.status(404).json({
        success: false,
        message: `Course ${courseNo} does not exists`,
      });
    }

    //return
    res.status(200).json({
      success: true,
      data: studentFound,
    });}
    else if(courseNo === undefined){
    let studentFound = students.filter(
      (c: Student) => c.studentId === studentId); 

    if (!studentFound) {
      return res.status(404).json({
        success: false,
        message: `Student ID ${studentId} does not exists`,
      });
    } 

    //return
    res.status(200).json({
      success: true,
      data: studentFound,
    });
    }else {
        return res.status(400).json({
        success: false,
        message: `Please provides either student ID or course number but not both.`,
      });
    }

  } else if(reqData.role === 'STUDENT'){
        let courseFound = enrollments.filter(
      (c: Enrollment) => c.studentId?.includes(String(reqData.studentId)))
      return res.status(200).json({
        success: true,
        course: courseFound,
      }
    ); 

  }

    //} catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something is wrong, please try again",
      //error: err,
    });
  //}
});

// POST /api/v2/enrollments
router.post('/', async (req: Request, res: Response) => {
  try {
    // Client data validation
    const parseResult = zEnrollmentEditBody.safeParse(req.body);
    const VerificationParseResult = zVerificationBody.safeParse(req.body);

    interface reqData{role : string, studentId : string}
    const reqData = jwt.verify(req.body.token,jwt_secret) as reqData;

    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parseResult.error.issues,
      });
    }

      if (reqData.role === 'ADMIN') {
      return res.status(403).json({
        ok: false,
        message: 'Only students can access this API route',
      });
    } else if(reqData.role === 'STUDENT'){

    let newEnrollment : Enrollment = {
    courseId : req.body.courseId,
    studentId : reqData.studentId}

    const isDuplicate = enrollments.some((c: Enrollment) => (c.courseId === newEnrollment.courseId && c.studentId === newEnrollment.studentId));
    if (isDuplicate) {
      return res.status(400).json({
        success: false,
        message: `You already enrolled in ${newEnrollment.courseId}.`,
      });
    }

    enrollments.push(newEnrollment);

    return res.status(201).json({
      success: true,
      message: 'Enrolled course successfully',
      data: newEnrollment,
    });}
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Something went wrong', error: err });
  }
});

// PUT /api/v2/enrollments
router.put('/', (req: Request, res: Response) => {
      return res.status(501).json({
        ok: false,
        message: 'PUT /api/v2/enrollments has not been implemented yet!',
      });
    })

// 4. DELETE

router.delete('/', (req: Request, res: Response) => {
  try {
        // Client data validation
    const parseResult = zEnrollmentEditBody.safeParse(req.body);
    const VerificationParseResult = zVerificationBody.safeParse(req.body);

    interface reqData{role : string, studentId : string}
    const reqData = jwt.verify(req.body.token,jwt_secret) as reqData;

    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parseResult.error.issues,
      });
    }

      if (reqData.role === 'ADMIN') {
      return res.status(403).json({
        ok: false,
        message: 'Only students can access this API route',
      });
    } else if(reqData.role === 'STUDENT'){

    let newEnrollment : Enrollment = {
    courseId : req.body.courseId,
    studentId : reqData.studentId}

    const isfound = enrollments.some((c: Enrollment) => (c.courseId === newEnrollment.courseId && c.studentId === newEnrollment.studentId));
    if (isfound) {

      const targetIndex = enrollments.findIndex((c: Enrollment) => 
    c.courseId === newEnrollment.courseId && c.studentId === newEnrollment.studentId
  );
    if (targetIndex !== -1) {
      enrollments.splice(targetIndex, 1);
    }

      return res.status(200).json({
        success: true,
        message: `You successfully unenrolled ${newEnrollment.courseId}.`,
      });
    } else{
    return res.status(404).json({
      success: true,
      message: `You have not currently enrolled ${newEnrollment.courseId}.`,
    });}}
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Something went wrong', error: err });
  }
});
export default router;
