import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './router/ProtectedRoute';
import { AdminRoute } from './router/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import QuestionsPage from './pages/QuestionsPage';
import QuestionDetailPage from './pages/QuestionDetailPage';
import HistoryPage from './pages/HistoryPage';
import HistoryDetailPage from './pages/HistoryDetailPage';
import StatsPage from './pages/StatsPage';
import InterviewStartPage from './pages/InterviewStartPage';
import InterviewSessionPage from './pages/InterviewSessionPage';
import SuggestQuestionPage from './pages/SuggestQuestionPage';
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