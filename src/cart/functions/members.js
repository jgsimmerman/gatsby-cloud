import dotenv from 'dotenv';
import { members, sendSparkpostConfirmation } from '../server';
dotenv.config({ silent: true });

import useMagicLink from 'use-magic-link';
import { Magic, MagicUserMetadata } from '@magic-sdk/admin';
//const magic = new Magic('sk_test_C9795F33831A21B8');


export async function handler(event, context, callback) {
  const magicSecretKey = 'sk_test_C9795F33831A21B8' //process.env.MAGIC_SECRET_KEY

  const magic = new Magic('sk_test_C9795F33831A21B8');
  const magicToken = event.headers.authorization.substring(7);
  console.log(magicToken);

 const metadata = await magic.users.getMetadataByToken(magicToken);
 console.log('members.js', metadata);


  //const res = await members(event)

  // return res

  return {
    statusCode: 200,
    // body: JSON.stringify({ contactId: contactId, accountId: accountId, email: metadata.email }),
    body: JSON.stringify({ contactId: 'contact1234',  email: metadata.email }),

  };
}
