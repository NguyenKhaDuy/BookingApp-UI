import React, { Fragment, useState } from 'react';
import TechnicianHero from '../../../Components/Client/TechnicianHero/TechnicianHero';
import TechnicianFilter from '../../../Components/Client/TechnicianFilter/TechnicianFilter';
import TechnicianGrid from '../../../Components/Client/TechnicianGrid/TechnicianGrid';
export default function TechnicianPage() {
    const [selected, setSelected] = useState('Tất cả');

    const technicians = [
        {
            id: 1,
            name: 'Nguyễn Văn A',
            skill: 'Điện',
            rating: 5,
            location: 'Hà Nội',
            avatar: 'https://i.pravatar.cc/150?img=1',
        },
        {
            id: 2,
            name: 'Trần Quốc B',
            skill: 'Điện lạnh',
            rating: 4,
            location: 'TP. Hồ Chí Minh',
            avatar: 'https://i.pravatar.cc/150?img=5',
        },
        {
            id: 3,
            name: 'Phạm Văn C',
            skill: 'Nước',
            rating: 5,
            location: 'Đà Nẵng',
            avatar: 'https://i.pravatar.cc/150?img=3',
        },
    ];

    const filtered = selected === 'Tất cả' ? technicians : technicians.filter((t) => t.skill === selected);
    return (
        <Fragment>
            <TechnicianHero />
            <TechnicianFilter selected={selected} onSelect={setSelected} />
            <TechnicianGrid list={filtered} />
        </Fragment>
    );
}
