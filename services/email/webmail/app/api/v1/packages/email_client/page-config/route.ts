/**
 * GET /api/v1/packages/email_client/page-config
 * Returns email_client package page configuration.
 */

import {
  type NextRequest,
  NextResponse,
} from 'next/server';
import { EMAIL_PAGE_CONFIG } from './pageConfigData';

export async function GET(_request: NextRequest) {
  try {
    return NextResponse.json(EMAIL_PAGE_CONFIG);
  } catch (error) {
    console.error(
      '[email-client-api] Error loading page config:',
      error,
    );
    return NextResponse.json(
      { error: 'Failed to load page configuration' },
      { status: 500 },
    );
  }
}
