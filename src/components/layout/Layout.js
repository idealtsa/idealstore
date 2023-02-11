import Head from "next/head";
const Layout = ({ children, title, description }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      {/* <Navbar /> */}
      <main>
        {/* <ToastContainer position="bottom-right" /> */}
        {children}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;

Layout.defaultProps = {
  title: "Ideal Store | V1.0 ",
  description: "this is the default description of the website",
};
