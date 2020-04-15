import React from "react"
import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import Accordion from "@lmack/accordion"
import "@lmack/accordion/styles.css"
import { Link } from "gatsby"

const testItems = [{ title: "Hi" }, { title: "Bye" }]

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
    <Accordion items={testItems} labelkey="title" />
    <div>
      <Link to="imageSlider">Image Slider</Link>
    </div>
  </Layout>
)

export default IndexPage
