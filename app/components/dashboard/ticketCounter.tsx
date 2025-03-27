import React, { useEffect, useState } from 'react';
import { getTotalTickets } from '~/utils/apiDasboard/statsDashboard';

const TicketDashboard: React.FC = () => {
    const [totalTickets, setTotalTickets] = useState<number>(0);

    useEffect(() => {
        const fetchTotalTickets = async () => {
            const total = await getTotalTickets();
            setTotalTickets(total);
        };

        fetchTotalTickets();
    }, []);

    return (
        <div className="bg-white shadow-md rounded-3xl p-2.5 w-full mx-auto text-center">
            <h2 className="text-sm font-semibold mb-1 text-black sm:text-base md:text-lg">
                Tickets
            </h2>
            <p className="text-xl font-bold text-blue-500 sm:text-2xl md:text-3xl">
                {totalTickets}
            </p>
        </div>
    );
};

export default TicketDashboard;
