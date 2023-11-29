import Link from "next/link";

import EmailSvg from "../svg/EmailSvg";
import PhoneSvg from "../svg/PhoneSvg";

import styles from "./Footer.module.css"

function Footer() {
  const DUMMY_FOOTER = [
    // {
    //   id: 0,
    //   title: "კომპანია",
    //   sub_titles: [
    //     {
    //       id: 0,
    //       title: "ჩვენ შესახებ",
    //       href: "/",
    //       svg: "",
    //       target: "_blank"
    //     },
    //     {
    //       id: 1,
    //       title: "კონფიდენციალურობის პოლიტიკა",
    //       href: "/",
    //       svg: "",
    //       target: "_blank"
    //     },
    //     {
    //       id: 2,
    //       title: "მომსახურების პირობები",
    //       href: "/",
    //       svg: "",
    //       target: "_blank"
    //     },
    //     {
    //       id: 3,
    //       title: "ხშირად დასმული კითხვები",
    //       href: "/",
    //       svg: "",
    //       target: "_blank"
    //     }
    //   ]
    // },
    {
      id: 1,
      title: "კონტაქტი",
      sub_titles: [
        {
          id: 0,
          title: "+995 599 000 000",
          href: "tel:+1234567890",
          svg: <PhoneSvg />,
          target: ""
        },
        {
          id: 1,
          title: "info@ReCounter.com",
          href: "mailto:info@recounter.com",
          svg: <EmailSvg />,
          target: ""
        }
      ]
    }
  ]
  return (
    <div className={styles.overlay}>
      <div className="container">
        <div className={styles.footer}>
          <div className={styles.logo}>
            <Link href="/">
              <img
                alt="Logo"
                src="/images/Logo.png"
                className="logo-default h-lg-50px"
              />
            </Link>
          </div>
          <div className={styles.body_col_wrapper}>
            {DUMMY_FOOTER.map((item, index) => {
              return (
                <div key={index + item.id} className={styles.body_col}>
                  <h3 className={styles.col_title}>
                    {item.title}
                  </h3>
                  {item.sub_titles.map((subItem, index) => {
                    return (
                      <div key={index + subItem.id} className={styles.col_sub}>
                        {subItem.svg}
                        <a target={subItem.target} href={subItem.href}>
                          {subItem.title}
                        </a>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Footer;
