import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import StudentLayout from '../components/StudentLayout';
import '../styles/globals.css'; // Make sure you have this global styles file

// List of student routes where the StudentLayout should be applied
const studentRoutes = [
  '/student/dashboard',
  '/student/overview',
  '/student/assessments',
  '/student/settings'
];

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Check if the current route is a student route
  const isStudentRoute = studentRoutes.some(route => 
    router.pathname.startsWith(route)
  );

  return (
    <>
      {isStudentRoute ? (
        <StudentLayout>
          <Component {...pageProps} />
        </StudentLayout>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
}

export default MyApp;
