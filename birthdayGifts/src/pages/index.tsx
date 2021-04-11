import LayoutOne from "../components/layouts/LayoutOne";


export default function Home() {
  return (
    <LayoutOne title="Homepage 1" SidebarResponsive={{ xs: 24, lg: 4 }} ContentResponsive={{ xs: 24, lg: 20 }}>
      <h2 style={{textAlign:'center'}}>Home Page for visitors</h2>
    </LayoutOne>
  );
}
