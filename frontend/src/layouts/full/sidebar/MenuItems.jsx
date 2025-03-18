  import { uniqueId } from 'lodash';
  import { TbLayoutDashboardFilled } from "react-icons/tb";
  import { HiDocumentText } from "react-icons/hi2";
  import { FaGraduationCap } from "react-icons/fa6";
  import { AiFillDatabase } from "react-icons/ai";

  const allMenus = {
    admin: [
      {
        navlabel: true,
        subheader: 'HOME',
      },
      {
        id: uniqueId(),
        title: 'Dashboard',
        icon: TbLayoutDashboardFilled,
        href: '/dashboard',
      },
      {
        navlabel: true,
        subheader: 'ALUMNI',
      },
      {
        id: uniqueId(),
        title: 'Tracer Study',
        icon: FaGraduationCap,
        href: '/tracerStudy',
      },
      {
        id: uniqueId(),
        title: 'Info Loker',
        icon: AiFillDatabase,
        href: '/info-lowongan-kerja',
      },
      {
        navlabel: true,
        subheader: 'KEMITRAAN',
      },
      {
        id: uniqueId(),
        title: 'MoU / Kerjasama',
        icon: HiDocumentText,
        href: '/mou-perusahaan',
      }
    ],
    perusahaan: [
      {
        navlabel: true,
        subheader: 'HOME',
      },
      {
        id: uniqueId(),
        title: 'Dashboard',
        icon: TbLayoutDashboardFilled,
        href: '/perusahaan',
      },
      {
        navlabel: true,
        subheader: 'MENU',
      },
      {
        id: uniqueId(),
        title: 'Info Lowongan Kerja',
        icon: AiFillDatabase,
        href: '/info_loker',
      }
    ],
    alumni: [
      {
        navlabel: true,
        subheader: 'HOME',
      },
      {
        id: uniqueId(),
        title: 'Dashboard',
        icon: TbLayoutDashboardFilled,
        href: '/alumni',
      },
      {
        navlabel: true,
        subheader: 'MENU',
      },
      {
        id: uniqueId(),
        title: 'Tracer Study',
        icon: FaGraduationCap,
        href: '/add-form-tracer-study',
      }
    ]
  };

  const getMenuItems = (userRole) => {
    return allMenus[userRole] || [];
  };

  export default getMenuItems;
