import { 
  Box, Text, HStack, Stack, Button, Container, Input,
  Heading, Image, Center, Link
} from '@chakra-ui/react'
import styles from '../styles/Home.module.css'
import { useState } from "react"
import { create, urlSource } from 'ipfs-http-client'
import { useValidate, useStateValidator } from "react-indicative-hooks"
import metadata from '../../../../../developer-004/Desktop/metadata.json'


const rules = {
  name: "required",
  email: "required|email"
}

const messages = {
  "name.required": "Please, fill the name input using your real name",
  "email.email": "You need to enter a valid email"
}

const client = create('https://ipfs.infura.io:5001/api/v0')

export default function Home({ time }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const error = useValidate({ name, email }, rules, messages)
  const [fileImage, updateFileImage] = useState(``)
  const [fileVideo, updateFileVideo] = useState(``)
  const [fileAudio, updateFileAudio] = useState(``)
  const [fileData, updateFileData] = useState(``)

  async function onChangeImage(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(file)
      const url = `https://cloudflare-ipfs.com/ipfs/${added.path}`
      updateFileImage(url)
      console.log("IMAGE CID ", added)
      console.log("IMAGE URL ", url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }
  async function onChangeVideo(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(file)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      updateFileVideo(url)
      console.log("VIDEO CID ", added)
      console.log("VIDEO URL ", url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }
  async function onChangeAudio(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(file)
      const url = `https://cloudflare-ipfs.com/ipfs/${added.path}`
      updateFileAudio(url)
      console.log("AUDIO CID ", added)
      console.log("AUDIO URL ", url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }
  async function onChangeData(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(file)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      updateFileData(url)
      console.log("METADATA", added)
      console.log("METADATA URL ", url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }
  function revalidate() {
    fetch('/api/revalidate')
  }
  return (
    <Box py={50} bgGradient="linear(to-r, #70e1f5, #ffd194)">
      <Container>
        <Stack>
          <Heading>{time}</Heading>
          <Button onClick={() => revalidate()}>Revalidate</Button>
        </Stack>
        <Stack pt={50}>
          <Heading>Indicative Hooks</Heading>
          <Heading size="md">Name</Heading>
          <Input placeholder="Bryan Diolata" value={name} onChange={e => setName(e.target.value)} />
          <Heading size="md">Email</Heading>
          <Input placeholder="bryan@?" value={email} onChange={e => setEmail(e.target.value)} />
          <Text textShadow="1px 1px" color="red.600">{error && error.message}</Text>
        </Stack>
        <Stack pt={50}>
          <Heading>IPFS Image</Heading>
          <Input type="file" onChange={onChangeImage} />
            { fileImage && ( 
            <Image h="400px" w="100%" objectFit="cover" objectPosition="center" src={fileImage} /> 
            // <video width="320" height="240" controls>
            //   <source src={fileUrl} type="video/mp4" />
            // </video>
            ) }
        </Stack>
        <Stack pt={50}>
          <Heading>IPFS Video</Heading>
          <Input type="file" onChange={onChangeVideo} />
            { fileVideo && ( 
            <video height="240px" width="800px" controls autoPlay>
              <source src={fileVideo} type="video/mp4" />
            </video>
            ) }
        </Stack>
        <Stack pt={50}>
          <Heading>IPFS Audio</Heading>
          <Input type="file" onChange={onChangeAudio} />
            { fileAudio && ( 
            <Center>
              <audio width="800px" controls>
                <source src={fileAudio} type="audio/mpeg" />
              </audio>
            </Center>
            ) }
        </Stack>
        <Stack pt={50}>
          <Heading>IPFS Metadata</Heading>
            <Text>Upload your JSON file</Text>
            <Input type="file" onChange={onChangeData} />
            { fileData && ( 
            <Center>
              <Link as="a" href={fileData} target="_blank">Click me</Link>
            </Center>
            ) }
        </Stack>
        
      </Container>
    </Box>
  )
}
export function getStaticProps() {
  console.log('[Next.js] Running getStaticProps...')
  return{
    props: {
      time: new Date().toISOString(),
    },
      revalidate: 60,
  }
}

