import { useState, useEffect } from 'react';
import useMagicLink from 'use-magic-link'

export default function MembersArea() {
    const auth = useMagicLink('pk_test_8659A943739758FA');
    const [members, setMembers] = useState(null);

    useEffect(() => {
        if (auth.loggedIn) {
            auth.fetch('https://sweetleaf-gc.netlify.app/.netlify/functions/members')
                .then(res => res.json())
                .then((payload) => {
                    setMembers(payload);
                })
        }
    }, [auth.loggedIn])

    if (!auth.loggedIn) {
        return (<div>Not Authorized!</div>)
    }

    if (members === null) {
        return (<div>Checking your account information ...</div>)
    }

    return (
        <div>
            Account Email: {members.email}.
        </div>
    )
}