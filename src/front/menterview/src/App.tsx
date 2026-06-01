import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute, AdminRoute } from './router/ProtectedRoute';
import { HomePage } from './pages/home/HomePage';
import LoginPage from './pages/login/LoginPage';
import RegisterPage from './pages/register/RegisterPage';
import ForgotPasswordPage from './pages/forgot-password/ForgotPasswordPage';
import ResetPasswordPage from './pages/reset-password/ResetPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/profile/ProfilePage';
import QuestionsPage from './pages/questions/QuestionsPage';
import QuestionDetailPage from './pages/question-detail/QuestionDetailPage';
import HistoryPage from './pages/history/HistoryPage';
import HistoryDetailPage from './pages/history-detail/HistoryDetailPage';
import StatsPage from './pages/stats/StatsPage';
import InterviewStartPage from './pages/interview-start/interview-start-page';
import InterviewSessionPage from './pages/interview-session/InterviewSessionPage';
import SuggestQuestionPage from './pages/suggest-question/SuggestQuestionPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminUserDetailPage from './pages/admin/AdminUserDetailPage';
import AdminPendingQuestionsPage from './pages/admin/AdminPendingQuestionsPage';
import AdminReferencePage from './pages/admin/AdminReferencePage';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
        toastClassName="!font-sans !text-sm !text-navy !rounded-xl !border !border-periwinkle !shadow-sm"
      />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/questions" element={<QuestionsPage />} />
            <Route path="/questions/:questionId" element={<QuestionDetailPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/history/:sessionId" element={<HistoryDetailPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/interview/start" element={<InterviewStartPage />} />
            <Route path="/interview/:sessionId" element={<InterviewSessionPage />} />
            <Route path="/questions/suggest" element={<SuggestQuestionPage />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/users/:userId" element={<AdminUserDetailPage />} />
            <Route path="/admin/questions/pending" element={<AdminPendingQuestionsPage />} />
            <Route path="/admin/reference" element={<AdminReferencePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;