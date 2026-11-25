'use client';

import { useActionState } from 'react';
import Icon from '@/components/Icon';
import { sendMagicLink, type SignInState } from './actions';

export default function SignInForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<SignInState, FormData>(sendMagicLink, { status: 'idle' });

  if (state.status === 'sent') {
    return (
      <div className="alert alert-ok" role="status">
        <Icon name="mail" />
        <div className="stack" style={{ gap: 6 }}>
          <p><strong>Check your inbox.</strong></p>
          <p>We sent a sign-in link to {state.email}. It works once and expires in an hour. No email after a few minutes? Check spam, or try again.</p>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="form" noValidate>
      <input type="hidden" name="next" value={next} />
      {state.status === 'error' && (
        <div className="alert alert-err" role="alert">
          <Icon name="alert" />
          <p>{state.message}</p>
        </div>
      )}
      <div className="fg">
        <label htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" autoComplete="email" required placeholder="e.g. you@studio.com" className="input" aria-describedby="email-help" />
        <p className="help" id="email-help">Use the email you paid with, so your membership and courses appear.</p>
      </div>
      <div>
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? (<><span className="spin" aria-hidden="true" />Sending link</>) : 'Email me a sign-in link'}
        </button>
      </div>
    </form>
  );
}
