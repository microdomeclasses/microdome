import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideCard } from "./features/profileCard/profileCardSlice.js";
import { initAnalytics } from "./analytics.js";

import Layout from "./Layout.jsx";

import {
  Dashboard,
  AddLecture,
  AddSection,
  AllUsers,
  PremiumUsers,
  AllCourses,
  CourseOverview,
  CourseSettings,
  CreateQuiz,
  CreateCourse,
  PremiumUserDetails,
  Coupons,
  CreateCoupon,
  AllQuizzes,
  QuizResults,
  EditQuiz,
  ResetQuizPrice,
  AdminMockTests,
  AdminMockTestSections,
  AdminMockTestQuestions,
  AdminMockTestBundles,
  AdminManageMockTestBundle,
  MonthlyFeeSheet,
  AdminBundleEnrollments,
  AdminBundleStudents,
  AdminMockTestResults,
  AdminMockTestFeedback,
  EditCourse,
  CourseSections,
} from "./components/Admin";

import {
  Home,
  Signup,
  Login,
  ForgotPassword,
  Courses,
  CourseLayout,
  AboutUs,
  ProfileDashboard,
  Resources,
  Faculties,
  CourseDetails,
  BScHonsBatch,
  EditUserDetails,
  CourseViewPage,
  Admin,
  SemesterCourseLayout,
  QuizList,
  QuizLayout,
  LoadingScreen,
  Developers,
  CheckOut,
  QuizResult,
  QuizLeaderboard,
  Exam,
  PageNotFound,
  MockTests,
  MockTestBundleDetails,
  MyBundleTests,
  MockTestInstructions,
  MockTestStart,
  MockTestResult,
  MockTestLeaderboard,
} from "./pages";

import {
  Navbar,
  AuthenticatedRoute,
  AuthLayout,
  PaymentSuccess,
  AdminLayout,
  Footer,
  ScrollToTop,
  AnalyticsTracker,
} from "./components";

import { useCourses } from "./hooks/courses.js";
import { useAuth } from "./hooks/auth.js";
import { useEnrolledTestBundles } from "./hooks/getEnrolledMockTestBundles.js";

const App = () => {
  useEffect(() => {
    initAnalytics();
  }, []);

  const isProfileCardHidden = useSelector((state) => state.profileCard.show);
  const dispatch = useDispatch();
  const { loading } = useAuth();
  useEnrolledTestBundles();
  // useCourses();

  if (loading) {
    return (
      <div className="w-full">
        <LoadingScreen />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AnalyticsTracker />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<Home />} />

          <Route path="/courses" element={<CourseLayout />}>
            <Route path="" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
          </Route>

          {/* Mock Test Routes*/}
          <Route path="/mock-tests" element={<MockTests />} />
          <Route
            path="/mock-tests/bundles/:bundleId"
            element={<MockTestBundleDetails />}
          />

          <Route path="/resources" element={<Resources />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/faculties" element={<Faculties />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/exams-and-institutes" element={<Exam />} />
        </Route>
        <Route path="/signup" element={<AuthLayout />}>
          <Route path="" element={[<Navbar/>, <Signup />]} />
        </Route>
        <Route path="/profile" element={<AuthenticatedRoute />}>
          <Route path="" element={[<ProfileDashboard />, <Navbar />]} />
          <Route path="edit" element={[<EditUserDetails />, <Navbar />]} />
        </Route>
        <Route path="/login" element={<AuthLayout />}>
          <Route path="" element={[<Navbar/> , <Login />]} />
        </Route>
        <Route path="/forgot-password" element={<AuthLayout />}>
          <Route path="" element={[<Navbar/>, <ForgotPassword />]} />
        </Route>
        <Route path="/my-courses/:id" element={<CourseViewPage />} />

        {/* Admin Routes */}

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="" element={<Admin />}>
            <Route path="dashboard" element={<Dashboard />} />

            <Route path="add-lecture" element={<AddLecture />} />
            <Route path="add-section" element={<AddSection />} />

            <Route path="users" element={<AllUsers />} />
            <Route path="courses" element={<AllCourses />} />
            <Route path="courses/:courseId" element={<CourseOverview />} />
            <Route path="courses/:courseId/sections" element={<CourseSections />} />
            <Route path="courses/:courseId/settings" element={<CourseSettings />} />
            <Route path="premium-users" element={<PremiumUsers />} />
            <Route path="courses/:id/enrollments" element={<PremiumUserDetails />} />
            <Route path="quizzes" element={<AllQuizzes />} />
            <Route path="create-quiz" element={<CreateQuiz />} />
            <Route path="edit-quiz/:quizId" element={<EditQuiz />} />
            <Route path="quiz-result/:quizId" element={<QuizResults />} />
            <Route path="reset-quiz-price" element={<ResetQuizPrice />} />
            <Route path="courses/new" element={<CreateCourse />} />
            <Route path="courses/:courseId/edit" element={<EditCourse />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="coupons/create" element={<CreateCoupon />} />
            <Route path="mock-tests" element={<AdminMockTests />} />
            <Route
              path="mock-tests/:mockTestId"
              element={<AdminMockTestSections />}
            />
            <Route
              path="mock-tests/:mockTestId/results"
              element={<AdminMockTestResults />}
            />
            <Route
              path="mock-tests/:mockTestId/feedbacks"
              element={<AdminMockTestFeedback />}
            />
            <Route
              path="mock-tests/:mockTestId/:mockTestSectionId/questions"
              element={<AdminMockTestQuestions />}
            />
            <Route
              path="mock-test-bundles"
              element={<AdminMockTestBundles />}
            />
            <Route
              path="bundles/enrollments"
              element={<AdminBundleEnrollments />}
            />
            <Route
              path="mock-test-bundles/:bundleId"
              element={<AdminManageMockTestBundle />}
            />
            <Route
              path="bundles/:bundleId/students"
              element={<AdminBundleStudents />}
            />
            <Route
              path="courses/:courseId/fees"
              element={<MonthlyFeeSheet />}
            />
          </Route>
        </Route>
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/quizzes" element={[<QuizList />, <Navbar />]} />
        <Route path="/quiz/:quizId" element={<QuizLayout />} />
        <Route path="/quiz/result/:quizId" element={<QuizResult />} />
        <Route
          path="/quiz/leaderboard/:quizId"
          element={[<QuizLeaderboard />, <Navbar />]}
        />
        <Route path="/checkout/:itemType/:id" element={<CheckOut />} />
        <Route path="*" element={<PageNotFound />} />

        {/* Mock Test Routes */}
        <Route
          path="/my-bundles/:bundleId"
          element={[<MyBundleTests />, <Navbar />]}
        />
        <Route path="/mock-tests/:testId" element={<MockTestInstructions />} />
        <Route path="/mock-tests/:testId/start" element={<MockTestStart />} />
        <Route path="/mock-tests/:testId/result" element={<MockTestResult />} />
        <Route
          path="/mock-tests/:testId/leaderboard"
          element={<MockTestLeaderboard />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
