import React from 'react';
import CrudPage from '../../components/CrudPage';
import { useParams } from 'react-router-dom';
import { getSessionService } from '../../services/sessionService';
import { Session } from '../../models/Session';

const ListSessions: React.FC = () => {
    const { id: userId } = useParams<{ id: string }>();

    if (!userId) return <div>Usuario no válido</div>;

    const service = getSessionService(userId);

    return (
        // ListSessions.tsx
        <CrudPage<Session>
            title="Sesiones"
            service={service}
            columns={['id', 'token', 'expiration', 'FACode', 'state']}
            routeBase={`/sessions/user/${userId}`}
        />
    );
};

export default ListSessions;
