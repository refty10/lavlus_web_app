import React from 'react';
import { Container, Center, Stack, Input, Textarea, Button, Text, Heading } from '@chakra-ui/react';
import { Radio, RadioGroup } from '@chakra-ui/react';
import { FormErrorMessage, FormLabel, FormControl } from '@chakra-ui/react';
import { firebaseAuth } from '@/utils';
import { LavlusApi } from '@/utils';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { BirthdayPicker } from 'react-birthday-picker';
import { parse } from 'date-fns';
import ja from 'date-fns/locale/ja';
import { NextPageWithLayoutAndPageExtraInfo, RequesterInfo } from '@/types';

// @ts-ignore
const schema: yup.SchemaOf<Omit<RequesterInfo, 'createdAt' | 'updatedAt'>> = yup.object().shape({
  realm: yup.string().required('必須項目です'),
  gender: yup
    .mixed<'male' | 'female' | 'other'>()
    .oneOf(['male', 'female', 'other'])
    .required('必須項目です'),
  organization: yup.string().required('必須項目です'),
  url: yup.string().required('必須項目です'),
  birthDate: yup.date().required('必須項目です'),
  introduction: yup.string(),
});

const RequesterInfo: NextPageWithLayoutAndPageExtraInfo = () => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RequesterInfo>({
    defaultValues: {
      realm: '',
      gender: 'male',
      organization: '',
      url: '',
      birthDate: '',
      introduction: '',
    },
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<RequesterInfo> = async (values) => {
    // Stringの生年月日をDateに変換
    if (typeof values.birthDate === 'string') {
      values.birthDate = parse(values.birthDate, 'yyyy/MM/dd', new Date(), { locale: ja });
    }

    console.log(JSON.stringify(values, null, 2));

    if (firebaseAuth.currentUser) {
      const data = await LavlusApi.registerRequesterInfo({
        values,
        token: await firebaseAuth.currentUser.getIdToken(),
      });
      if (data) router.replace(`/${firebaseAuth.currentUser.displayName}`);
    }
  };

  return (
    <Container maxW="1000px" h="100vh">
      <Center w="100%" h="100%">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={4} align="center">
            <Heading size="3xl">依頼者登録 🎓</Heading>
            <Text maxW="500px">
              Lavlusで依頼者として利用を行うには依頼者登録をする必要が
              あります。これは、協力者にとってどんな人物からの依頼なのかを判断するために必要な情報です。以下のフォームを入力し、続行してください。
            </Text>

            <FormControl isInvalid={!!errors.realm}>
              <FormLabel htmlFor="realm">
                <Text borderLeft="12px solid #ED8936" pl="12px" fontWeight="bold" fontSize="lg">
                  氏名
                </Text>
              </FormLabel>
              <Input id="realm" placeholder="realm" {...register('realm')} />
              <FormErrorMessage>{errors.realm && errors.realm.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.realm}>
              <FormLabel htmlFor="realm">
                <Text borderLeft="12px solid #ED8936" pl="12px" fontWeight="bold" fontSize="lg">
                  性別
                </Text>
              </FormLabel>
              <Controller
                control={control}
                name="gender"
                render={({
                  field: { onChange, onBlur, value, name, ref },
                  // fieldState: { invalid, isTouched, isDirty, error },
                  // formState,
                }) => (
                  <RadioGroup onChange={onChange} value={value}>
                    <Stack direction="row">
                      <Radio value="male">男性</Radio>
                      <Radio value="female">女性</Radio>
                      <Radio value="other">その他</Radio>
                    </Stack>
                  </RadioGroup>
                )}
              />
              <FormErrorMessage>{errors.realm && errors.realm.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.organization}>
              <FormLabel htmlFor="organization">
                <Text borderLeft="12px solid #ED8936" pl="12px" fontWeight="bold" fontSize="lg">
                  所属機関
                </Text>
              </FormLabel>
              <Input id="organization" placeholder="organization" {...register('organization')} />
              <FormErrorMessage>
                {errors.organization && errors.organization.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.url}>
              <FormLabel htmlFor="url">
                <Text borderLeft="12px solid #ED8936" pl="12px" fontWeight="bold" fontSize="lg">
                  Webページ
                </Text>
              </FormLabel>
              <Input id="url" placeholder="url" {...register('url')} />
              <FormErrorMessage>{errors.url && errors.url.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.birthDate}>
              <FormLabel htmlFor="birthDate">
                <Text borderLeft="12px solid #ED8936" pl="12px" fontWeight="bold" fontSize="lg">
                  生年月日
                </Text>
              </FormLabel>
              <Controller
                control={control}
                name="birthDate"
                render={({
                  field: { onChange, onBlur, value, name, ref },
                  // fieldState: { invalid, isTouched, isDirty, error },
                  // formState,
                }) => (
                  <BirthdayPicker
                    onChange={onChange}
                    placeHolders={['日', '月', '年']}
                    style={{ width: '400px' }}
                  />
                )}
              />
              <FormErrorMessage>{errors.birthDate && errors.birthDate.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.introduction}>
              <FormLabel htmlFor="introduction">
                <Text borderLeft="12px solid #ED8936" pl="12px" fontWeight="bold" fontSize="lg">
                  自己紹介
                </Text>
              </FormLabel>
              <Textarea
                id="introduction"
                placeholder="introduction"
                {...register('introduction')}
              />
              <FormErrorMessage>
                {errors.introduction && errors.introduction.message}
              </FormErrorMessage>
            </FormControl>

            <Button w="100%" mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
              依頼者登録をする
            </Button>
          </Stack>
        </form>
      </Center>
    </Container>
  );
};

export default RequesterInfo;
