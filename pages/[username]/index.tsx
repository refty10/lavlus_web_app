import React from 'react';
import { useRouter } from 'next/router';
import type { NextPage, GetServerSideProps } from 'next';
import {
  Box,
  Text,
  Image,
  Button,
  Heading,
  Avatar,
  Stack,
  Flex,
  Grid,
  GridItem,
  Center,
  Divider,
} from '@chakra-ui/react';
import useSWR from 'swr';
import { fetchWithToken } from '../../utils';
import { User, Project } from '../../types';

import { useRecoilValue } from 'recoil';
import { authState } from '../../recoil/atoms';

const ProjectList: NextPage = () => {
  const router = useRouter();
  const { username } = router.query;
  const auth = useRecoilValue(authState);
  const { data: projects } = useSWR<Project[]>(
    ['/users/me/projects', auth.token],
    fetchWithToken,
  );

  return (
    <Grid templateRows="40px auto" templateColumns="320px 1fr" gap={12} px={12}>
      <GridItem colSpan={2}>
        <Heading>{username}のProject一覧</Heading>
      </GridItem>

      <GridItem>
        <Center>
          <OwnerInfo />
        </Center>
      </GridItem>

      <Stack spacing={6}>
        <Flex justify="end">
          <Button w={100} colorScheme="teal">
            + New
          </Button>
        </Flex>

        <Divider />
        {projects?.map(project => (
          <ProjectCard project={project} key={project.id} />
        ))}

        <Grid
          h="200px"
          bg="gray.400"
          borderRadius="xl"
          p={4}
          onClick={() => router.push('/user/aaa')}
        >
          <Text>だみー</Text>
        </Grid>
      </Stack>

      {/* <Text>{username}</Text> */}
      {/* <pre>{JSON.stringify(userData, null, 2)}</pre>
      <pre>{JSON.stringify(projects, null, 2)}</pre> */}
    </Grid>
  );
};

interface ProjectCardProps {
  project: Project;
}

const OwnerInfo = () => {
  return (
    <Stack>
      <Avatar
        size="3xl"
        src="https://avatars.githubusercontent.com/u/46354485?v=4"
      />
      <Text fontSize="4xl" fontWeight="bold">
        @miyagawa
      </Text>
      <Text fontSize="2xl">Miyagawa Nobuhito</Text>
      <Text color="gray.300">Programmer & Designer & Illustrator</Text>
    </Stack>
  );
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const router = useRouter();
  return (
    <Grid
      h="200px"
      bg="gray.400"
      borderRadius="xl"
      p={4}
      onClick={() => router.push('/user/aaa')}
    >
      <Text>{project.name}</Text>
      <Image h="100px" src={project.image} alt="ProjectImage" />
    </Grid>
  );
};

export const getServerSideProps: GetServerSideProps = async context => ({
  props: {
    layout: 'standard',
    authenticated: true,
  },
});

export default ProjectList;
