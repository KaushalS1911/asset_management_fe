import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

import { AuthGuard } from 'src/auth/guard';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------
// SETTING PROFILE

import { AssetsCreateView, AssetsEditView, AssetsListView } from '../../sections/assets/view';
import ServiceListView from '../../sections/service/view/service-list-view';
import ServiceCreateView from '../../sections/service/view/service-create-view';
import ServiceEditView from '../../sections/service/view/servce-edit-view';
import AssetInfo from '../../sections/assets/view/asset-info';
import AssetListPage from '../../pages/dashboard/asset';
import ServiceListPage from '../../pages/dashboard/service';
import AmcListPage from '../../pages/dashboard/amc';
import AMCCreateView from '../../sections/amc/view/amc-create-view';
import AMCEditView from '../../sections/amc/view/amc-edit-view';
import { SettingsPage } from '../../sections/settings/view';


// OVERVIEW
const IndexPage = lazy(() => import('src/pages/dashboard/dashboard'));

//COMPLAIN

// TEST RENDER PAGE BY ROLE

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      { path: 'setting', element: <SettingsPage /> },
      // { path: 'complain', element: <ComplainListView /> },
      // {
      //   path: 'fees',
      //   children: [
      //     { element: <FeesPage />, index: true },
      //     { path: ':id/fee-invoice/:installmentID/installment', element: <InvoiceDetailsView /> },
      //   ],
      // },
      // {
      //   path: 'inquiry',
      //   children: [
      //     { element: <InquiryListPage />, index: true },
      //     { path: 'list', element: <InquiryListPage /> },
      //     { path: 'new', element: <InquiryCreatePage /> },
      //     { path: ':id/edit', element: <InquiryEditPage /> },
      //   ],
      // },
      // {
      //   path: 'profile',
      //   children: [
      //     { element: <UserProfileView />, index: true },
      //     { path: 'new', element: <UserEditProfile /> },
      //   ],
      // },
      // {
      //   path: 'student',
      //   children: [
      //     { element: <StudentProfilePage />, index: true },
      //     { path: 'profile', element: <StudentProfilePage /> },
      //     { path: 'cards', element: <StudentCardsPage /> },
      //     { path: 'list', element: <StudentListPage /> },
      //     { path: 'new', element: <StudentCreatePage /> },
      //     { path: ':id/edit', element: <StudentEditPage /> },
      //     { path: ':id/studentView', element: <StudentViewPage /> },
      //     { path: ':id/guaridiandetails', element: <GuardianDetailsPage /> },
      //   ],
      // },
      // {
      //   path: 'account',
      //   children: [
      //     { element: <AccountListPage />, index: true },
      //     { path: 'list', element: <AccountListPage /> },
      //   ],
      // },
      // {
      //   path: 'employee',
      //   children: [
      //     { element: <EmployeeProfilePage />, index: true },
      //     { path: 'profile', element: <EmployeeProfilePage /> },
      //     { path: 'cards', element: <EmployeeCardsPage /> },
      //     { path: 'list', element: <EmployeeListPage /> },
      //     { path: 'new', element: <EmployeeCreatePage /> },
      //     { path: ':id/edit', element: <EmployeeEditPage /> },
      //     { path: 'account', element: <EmployeeAccountPage /> },
      //   ],
      // },
      // {
      //   path: 'demo',
      //   children: [
      //     { element: <DemoListPage />, index: true },
      //     { path: 'list', element: <DemoListPage /> },
      //   ],
      // },
      // {
      //   path: 'profile',
      //   element: <UserProfile />,
      // },
      // {
      //   path: 'expenses',
      //   children: [
      //     { element: <ExpenseListPage />, index: true },
      //     { path: 'list', element: <ExpenseListPage /> },
      //     { path: 'new', element: <ExpensesCreatePage /> },
      //     { path: ':id/edit', element: <ExpensesEditPage /> },
      //   ],
      // },
      // {
      //   path: 'task',
      //   children: [
      //     { element: <TaskListPage />, index: true },
      //     { path: 'list', element: <TaskListPage /> },
      //     { path: 'new', element: <TaskCreatePage /> },
      //     { path: ':id/edit', element: <TaskEditPage /> },
      //   ],
      // },
      // {
      //   path: 'visit',
      //   children: [
      //     { element: <VisitListPage />, index: true },
      //     { path: 'list', element: <VisitListPage /> },
      //     { path: 'new', element: <VisitCreatePage /> },
      //     { path: ':id/edit', element: <VisitEditPage /> },
      //   ],
      // },
      // {
      //   path: 'examination',
      //   children: [
      //     { element: <ExaminationListPage />, index: true },
      //     { path: 'list', element: <ExaminationListPage /> },
      //     { path: 'new', element: <ExaminationCreatePage /> },
      //     { path: ':id/edit', element: <ExaminationEditPage /> },
      //     { path: ':batchExamId/examoverview', element: <ExamOverviewPage /> },
      //   ],
      // },
      // {
      //   path: 'batches',
      //   children: [
      //     { element: <BatchListPage />, index: true },
      //     { path: 'list', element: <BatchListPage /> },
      //     { path: 'new', element: <BatchCreatePage /> },
      //     { path: ':id/edit', element: <BatchEditPage /> },
      //     { path: ':id/view', element: <RegisterView /> },
      //   ],
      // },
      // {
      //   path: 'seminar',
      //   children: [
      //     { element: <SeminarListPage />, index: true },
      //     { path: 'new', element: <SeminarCreatePage /> },
      //     { path: 'list', element: <SeminarListPage /> },
      //     { path: ':id/edit', element: <SeminarEditPage /> },
      //   ],
      // },
      {
        path: 'assets',
        children: [
          { element: <AssetsListView />, index: true },
          { path: 'new', element: <AssetsCreateView /> },
          { path: 'list', element: <AssetListPage /> },
          { path: ':id', element: <AssetsEditView /> },
          { path: ':id/view', element: <AssetInfo /> },
        ],
      },
      {
        path: 'service',
        children: [
          { element: <ServiceListPage />, index: true },
          { path: 'new', element: <ServiceCreateView /> },
          { path: 'list', element: <ServiceListPage /> },
          { path: ':id/edit', element: <ServiceEditView /> },
        ],
      },
      {
        path: 'amc',
        children: [
          { element: <AmcListPage />, index: true },
          { path: 'new', element: <AMCCreateView /> },
          { path: 'list', element: <AmcListPage /> },
          { path: ':id/edit', element: <AMCEditView /> },
        ],
      },
      // {
      //   path: 'attendance',
      //   children: [
      //     { element: <AttendanceListPage />, index: true },
      //     { path: 'list', element: <AttendanceListPage /> },
      //     { path: 'new', element: <AttendanceCreatePage /> },
      //   ],
      // },
      // {
      //   path: 'invoice',
      //   children: [
      //     { element: <InvoiceListPage />, index: true },
      //     { path: 'list', element: <InvoiceListPage /> },
      //     { path: ':id', element: <InvoiceDetailsPage /> },
      //     { path: ':id/edit', element: <InvoiceEditPage /> },
      //     { path: 'new', element: <InvoiceCreatePage /> },
      //   ],
      // },
      // { path: 'calendar', element: <CalendarPage /> },
      // { path: 'setting', element: <SettingsPage /> },
    ],
  },
  // {
  //   path: 'invite-user',
  //   element: (
  //     <AuthGuard>
  //       <Suspense fallback={<LoadingScreen />}>
  //         <AuthClassicLayout register={true} invite={true}>
  //           <InviteUserView />
  //         </AuthClassicLayout>
  //       </Suspense>
  //     </AuthGuard>
  //   ),
  // },
];
