import { Menu } from "semantic-ui-react";

import { useRouter } from "next/router";

export default function Gnb_Top() {
  const router = useRouter();
  let activeItem;

  if (router.pathname === "/map") {
    activeItem = "main";
  }
  //  else if (router.pathname === "/about") {
  //   activeItem = "about";
  // }
   else if (router.pathname === "/logout") {
    activeItem = "logout";
  }

  function goLink(e, data) {
    if (data.name === "main") {
      router.push("/map");
    } else if (data.name === "logout") {
      router.push("/logout");
    }
  }

  return (
    <Menu pointing secondary>
      <Menu.Item name="main" active={activeItem === "main"} onClick={goLink} />
      <Menu.Menu position='right'>
        <Menu.Item name="logout" active={activeItem === "logout"} onClick={goLink}
        />
      </Menu.Menu>
      
      {/* <Menu.Item
        name="Contact Us"
        active={activeItem === "contact"}
        onClick={() => {
          router.push("/contact");
        }}
      />
      <Menu.Item
        name="Admin"
        active={activeItem === "admin"}
        onClick={() => {
          router.push("/admin");
        }}
      /> */}
    </Menu>
  );
}