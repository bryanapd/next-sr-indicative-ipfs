import { create } from 'ipfs-http-client'
import { useState, useEffect } from 'react'
import { 
  Box, Container, Heading, FormControl, FormLabel, 
  Input, Button, Textarea, Link, Text, VStack, Image, 
  Spinner, Stack, Grid
} from '@chakra-ui/react';


const client = create('https://ipfs.infura.io:5001/api/v0')

export default function Home() {  
  const [cid, setCid] = useState("")
  const [fileUrl, setFileUrl] = useState("")
  const [jsonData, setJsonData] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const [item, setItem] = useState({
    item: '',
    album: '',
    tracks: '',
    price: ''
  })

  async function onChange ({ target: { name, value, files } }) {
    switch (name) {
      case 'album':
        setItem({ ...item, [name]: value })
        break;
      case 'tracks':
        setItem({ ...item, [name]: parseInt(value) })
        break;
      case 'price':
        setItem({ ...item, [name]: parseFloat(value) })
        break;  
      case 'file':
        const file = files[0]
        console.log(file)
        try {
          const added = await client.add(file)
          const url = `https://cloudflare-ipfs.com/ipfs/${added.path}`
          console.log(added)
          console.log("cid: " + added.cid)
          console.log("url: " + url)
          setItem({ ...item, [name]: url })
        } catch (error) {
          console.log('Error uploading file: ', error)
        }  
        break;  
      default:
        setItem({ ...item, [name]: value })
        break;
    }
  }

  async function upload() {
    setIsLoading(true)
    const jsonData = JSON.stringify(item)
    try {
      const added = await client.add(jsonData)
      const url = `https://cloudflare-ipfs.com/ipfs/${added.path}`
      console.log(added)
      console.log("cid: " + added.cid)
      console.log("url: " + url)
      setCid(added.path)
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function getJsonData(fileUrl) {
    try {
      const data = await fetch(fileUrl)
      const json = await data.json()
      setJsonData(json)
      setIsLoading(false)
    } catch (error) {
      console.log('Error getting json data: ', error)
    }  
  }

  useEffect(() => {
    getJsonData(fileUrl)
    console.log(jsonData)
  }, [fileUrl])

  return (
    <Box pt={16} h="100vh" bgGradient="linear(to-r, #0F2027, #203A43, #2C5364)" color="white">
      <Container maxW="container.xl">
        <Heading size="lg" mb={10}>MY FAVORITE GIRL</Heading>
        <Grid templateColumns={{ base: 'auto', md: 'repeat(2, 1fr)'}} gap={10}>
          <Stack spacing={5}>
            <FormControl>
              <FormLabel>Image</FormLabel>
              <Input variant="unstyled" name="file" type="file" onChange={onChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Artist</FormLabel>
              <Input color="black" variant="filled" name="item" onChange={onChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Album</FormLabel>
              <Input color="black" variant="filled" type="text" name="album" onChange={onChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Tracks</FormLabel>
              <Input color="black" variant="filled" type="number" name="tracks" onChange={onChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Price</FormLabel>
              <Input color="black" variant="filled" type="number" name="price" onChange={onChange} />
            </FormControl>
            <Button bg="teal.500" onClick={upload}>UPLOAD</Button>
          </Stack>
        {
          isLoading && <Spinner />
        }
        {
          jsonData ? (
            <Stack direction="row" align="start" spacing={2} mb={8}>
              <Image src={jsonData.file} boxSize="300px" objectFit="cover" />
              <Box>
                <Text>Artist: {jsonData.item}</Text>
                <Text>Album: {jsonData.album}</Text>
                <Text>Tracks: {jsonData.tracks}</Text>
                <Text>Price: {jsonData.price}</Text>
                {
                  fileUrl && (
                    <Link as="a" href={fileUrl} target="_blank">
                      <Button bg="teal.500" mt={4}>Get the link</Button>
                    </Link>
                  )
                }
              </Box>
            </Stack>
          ) : null
        }  
        </Grid>
      </Container>  
    </Box>
  )
}