/**
 * Root Page
 *
 * Redirects to the dashboard page.
 *
 * @module app/page
 */

import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/dashboard');
}
