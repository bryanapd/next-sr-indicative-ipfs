import { useState, useEffect } from "react"
import { useStateValidator, useValidate } from "react-indicative-hooks"
import { useValidateAll } from "react-indicative-hooks"
import { create } from "ipfs-http-client"
import { Box, Button, Container, Text, Heading, HStack, Input, Spacer, Image, Spinner, Link, FormControl, FormLabel } from '@chakra-ui/react'

const client = create("https://ipfs.infura.io:5001/api/v0")

const faves = {
  anime: '',
  manga: ''
}

export default function Home() {
  const [show, setShow] = useState(false)
  const [hasChosenImage, setHasChosenImage] = useState(false)
  const [hasChosenVideo, setHasChosenVideo] = useState(false)
  const [hasChosenAudio, setHasChosenAudio] = useState(false)
  const [hasChosenJson, setHasChosenJson] = useState(false)
  const [fileUrlImage, updateFileUrlImage] = useState('')
  const [fileUrlVideo, updateFileUrlVideo] = useState('')
  const [fileUrlAudio, updateFileUrlAudio] = useState('')
  const [fileUrlJson, updateFileUrlJson] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [fileData, setFileData] = useState([])

  const data = []

  const [item, setItem] = useState(faves)


  async function onChangeImage(e) {
    setHasChosenImage(true)
    const file = e.target.files[0]
    try {
      const added = await client.add(file)
      const url = `https://cloudflare-ipfs.com/ipfs/${added.path}`
      console.log(added)
      console.log("cid: " + added.cid)
      console.log("url: " + url)
      updateFileUrlImage(url)
      data.push({
        "image": added.path
      })
      const dataJson = JSON.stringify(data)
      console.log(data)
      const blob = new Blob([dataJson], { type: 'application/json' })
      const jsonFile = new File([ blob ], 'file.json')
      const otherAdded = await client.add(jsonFile)
      const otherUrl = `https://cloudflare-ipfs.com/ipfs/${otherAdded.path}`
      console.log(otherAdded)
      console.log("cid: " + otherAdded.cid)
      console.log("url: " + otherUrl)
      updateFileUrlJson(otherUrl)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function onChangeVideo(e) {
    setHasChosenVideo(true)
    const file = e.target.files[0]
    try {
      const added = await client.add(file)
      const url = `https://cloudflare-ipfs.com/ipfs/${added.path}`
      console.log(added)
      console.log("cid: " + added.cid)
      console.log("url: " + url)
      updateFileUrlVideo(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function onChangeAudio(e) {
    setHasChosenAudio(true)
    const file = e.target.files[0]
    try {
      const added = await client.add(file)
      const url = `https://cloudflare-ipfs.com/ipfs/${added.path}`
      console.log(added)
      console.log("cid: " + added.cid)
      console.log("url: " + url)
      updateFileUrlAudio(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function uploadItem() {
    const jsonData = JSON.stringify(item)
    console.log(jsonData)
    try {
      const added = await client.add(jsonData)
      const url = `https://cloudflare-ipfs.com/ipfs/${added.path}`
      console.log(added)
      console.log("cid: " + added.cid)
      console.log("url: " + url)
      updateFileUrlJson(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function getJsonData(files) {
    try{
      const items = await fetch(files)
      const json = await items.json()
      setFileData(json)
    }
    catch(e) {
      console.log('Error cannot get files')
    }
  }

  function onChange ({ target: { name, value } }) {
    setItem({ ...item, [name]: value })
  }


  return (
    <Box h="100vh" bgGradient="linear(to-r, #283c86, #45a247)">
      <Container maxW="container.sm" pt={50} color="white">
        <Heading size="xl" mb={4}>IPFS</Heading>
        <Heading size="md" mb={2}>Image</Heading>
        <Input
          type="file"
          variant="unstyled"
          onChange={onChangeImage}
          mb={4} />
        {
          (!fileUrlImage && hasChosenImage === true) ? (
            <Spinner />
           ) : null
        }    
        {
          fileUrlImage && (
            <Box>
              <Image src={fileUrlImage} w="full" h="800px" />
              <Link as="a" href={fileUrlJson} target="_blank">
                Go to the link of json metadata
              </Link>
            </Box>
          )
        }
        <Heading size="md" mb={2}>Video</Heading>
        <Input
          type="file"
          variant="unstyled"
          onChange={onChangeVideo}
          mb={4} />
        {
          (!fileUrlVideo && hasChosenVideo === true) ? (
            <Spinner />
           ) : null
        }    
        {
          fileUrlVideo && (
            <video width="320" height="240" controls>
              <source src={fileUrlVideo} type="video/mp4" />
              <source src={fileUrlVideo} type="video/mov" />
              Your browser does not support the video tag.
            </video>
          )  
        }
        <Heading size="md" mb={2}>Audio</Heading>
        <Input
          type="file"
          variant="unstyled"
          onChange={onChangeAudio}
          mb={4} />
        {
          (!fileUrlAudio && hasChosenAudio === true) ? (
            <Spinner />
           ) : null
        }  
        {
          fileUrlAudio && (
            <audio width="320" height="240" controls>
              <source src={fileUrlAudio} type="audio/mp3" />
              Your browser does not support the video tag.
            </audio>
          )
        }
        <Heading size="md" mb={2}>JSON</Heading>
        <FormControl mb={4}>
          <FormLabel>Favorite Anime</FormLabel>
          <Input name="anime" variant="filled" onChange={onChange} />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Favorite Manga</FormLabel>
          <Input name="manga" variant="filled" onChange={onChange} />
        </FormControl>
        {
          (!fileUrlJson && hasChosenJson == false) ? 
          <Button onClick={uploadItem} bg="teal.300">UPLOAD!</Button>
          : ''
        }
        {/* <Input
          type="file"
          onChange={onChangeJson}
          mb={4} /> */}
        {
          (!fileUrlJson && hasChosenJson === true) ? (
            <Spinner />
           ) : null
        }  
        {
          fileUrlJson && (
            <Link as="a" href={fileUrlJson} target="_blank">
              <Button bg="teal.300">Get JSON Link</Button>
            </Link>
          )
        }
        {/* <Heading size="xl" mt={4} mb={2}>Static Regeneration</Heading>
        <Text mb={2}>{time}</Text>
        <Button onClick={() => revalidate()} mb={16}>Revalidate</Button> */}
        {/* {
          res.map((result, rKey) => (
            <Text key={rKey}>{result}</Text>
          ))
        } */}
        <Button bg="teal.500" onClick={() => setShow(true)}>Fetch Data</Button>
        {
          show == true ?
          <Box mt={50}>
            <Text>bryan</Text>
            <Button onClick={() => setShow(false)}>Close</Button>
          </Box>
          : null
        }
      </Container>
    </Box>
  )
}