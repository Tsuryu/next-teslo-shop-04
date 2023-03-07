import { FC, ChangeEvent, SyntheticEvent, useEffect, useState, useRef } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import DriveFileRenameOutline from '@mui/icons-material/DriveFileRenameOutline';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import UploadOutlined from '@mui/icons-material/UploadOutlined';
import {
  Box,
  Button,
  capitalize,
  Card,
  CardActions,
  CardMedia,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField
} from '@mui/material';

import { IGender, IProduct, ISize, IType } from '@/interfaces';
import { AdminLayout } from '@/layouts';
import { dbProducts } from '@/database';
import { tesloApi } from '@/api';
import { Product } from '@/models';

const validTypes = ['shirts', 'pants', 'hoodies', 'hats'];
const validGender = ['men', 'women', 'kid', 'unisex'];
const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

interface FormData {
  _id?: string;
  description: string;
  images: string[];
  inStock: number;
  price: number;
  sizes: ISize[];
  slug: string;
  tags: string[];
  title: string;
  type: IType;
  gender: IGender;
}

interface Props {
  product: IProduct;
}

const ProductAdminPage: FC<Props> = ({ product }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
    setError,
    clearErrors
  } = useForm<FormData>({
    defaultValues: product
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'title') {
        const newSlug = value.title?.trim().replaceAll(' ', '_').replaceAll("'", '').toLocaleLowerCase() ?? '';
        setValue('slug', newSlug, { shouldValidate: true });
      }
      if (name === 'type') {
        clearErrors('type');
      }
      if (name === 'gender') {
        clearErrors('gender');
      }
      if (name === 'sizes') {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        value.sizes!.length === 0
          ? setError('sizes', { message: 'Debe seleccionar al menos 1 talla' })
          : clearErrors('sizes');
      }
    });

    return () => subscription.unsubscribe();
  }, [setValue, watch]);

  const onSubmit = async (formData: FormData) => {
    let hasError = false;
    if (formData.images.length < 2) {
      hasError = true;
      setError('images', { message: 'Minimo 2 imagenes' });
    }

    if (formData.type.length === 0) {
      hasError = true;
      setError('type', { message: 'Debe seleccionar un tipo' });
    }

    if (formData.gender.length === 0) {
      hasError = true;
      setError('gender', { message: 'Debe seleccionar un genero' });
    }
    if (formData.gender.length === 0) {
      hasError = true;
      setError('sizes', { message: 'Debe seleccionar al menos 1 talla' });
    }
    if (hasError) return;

    setIsSubmitting(true);
    try {
      await tesloApi({
        url: '/admin/products',
        method: formData._id ? 'PUT' : 'POST',
        data: formData
      });

      if (!formData._id) return await router.replace(`/admin/products/${formData.slug}`);

      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  const handleRadioButtonChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.name as any, e.target.value as IType, { shouldValidate: true });

  const handleChangeSize = (e: SyntheticEvent<Element, Event>) => {
    const { target }: any = e;
    const currentSizes = getValues('sizes');

    setValue(
      'sizes',
      currentSizes.includes(target.value)
        ? currentSizes.filter((size) => size !== target.value)
        : [...currentSizes, target.value],
      { shouldValidate: true }
    );
  };

  const handleTagChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.includes(' ')) {
      const currentTags = getValues('tags');
      const newTag = e.target.value.trim();
      if (!currentTags.includes(newTag)) setValue('tags', [...currentTags, newTag], { shouldValidate: true });
      setTagInput('');
      return;
    }
    setTagInput(e.target.value);
  };

  const onDeleteTag = (tag: string) => {
    setValue(
      'tags',
      getValues('tags').filter((t) => t !== tag),
      { shouldValidate: true }
    );
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = async ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { files } = target;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    try {
      Object.values(files).forEach(async (file) => {
        formData.append(`file`, file);
        const { data } = await tesloApi.post('/admin/uploads', formData);
        console.log(data);
        setValue('images', [...getValues('images'), data.message], { shouldValidate: true });
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteImage = (image: string) => {
    setValue(
      'images',
      getValues('images').filter((img) => img !== image),
      { shouldValidate: true }
    );
  };

  return (
    <AdminLayout title="Producto" subtitle={`Editando: ${product.title}`} icon={<DriveFileRenameOutline />}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" justifyContent="end" sx={{ mb: 1 }}>
          <Button
            color="secondary"
            startIcon={<SaveOutlined />}
            sx={{ width: '150px' }}
            type="submit"
            disabled={isSubmitting}>
            Guardar
          </Button>
        </Box>

        <Grid container spacing={2}>
          {/* Data */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Título"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register('title', {
                required: 'Este campo es requerido',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' }
              })}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            <TextField
              label="Descripción"
              variant="filled"
              fullWidth
              multiline
              sx={{ mb: 1 }}
              {...register('description', {
                required: 'Este campo es requerido'
              })}
              error={!!errors.description}
              helperText={errors.description?.message}
            />

            <TextField
              label="Inventario"
              type="number"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register('inStock', {
                required: 'Este campo es requerido',
                min: { value: 0, message: 'Minimo de 0' }
              })}
              error={!!errors.inStock}
              helperText={errors.inStock?.message}
            />

            <TextField
              label="Precio"
              type="number"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register('price', {
                required: 'Este campo es requerido',
                min: { value: 0, message: 'Minimo de 0' }
              })}
              error={!!errors.price}
              helperText={errors.price?.message}
            />

            <Divider sx={{ my: 1 }} />

            <FormControl sx={{ mb: 1 }}>
              <FormLabel>Tipo</FormLabel>
              <RadioGroup row value={getValues('type')} onChange={handleRadioButtonChange} name="type">
                {validTypes.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio color="secondary" />}
                    label={capitalize(option)}
                  />
                ))}
              </RadioGroup>
              {!!errors.type && <FormHelperText error>{errors.type?.message}</FormHelperText>}
            </FormControl>

            <FormControl sx={{ mb: 1 }}>
              <FormLabel>Género</FormLabel>
              <RadioGroup row value={getValues('gender')} onChange={handleRadioButtonChange} name="gender">
                {validGender.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio color="secondary" />}
                    label={capitalize(option)}
                  />
                ))}
              </RadioGroup>
              {!!errors.gender && <FormHelperText error>{errors.gender?.message}</FormHelperText>}
            </FormControl>

            <FormGroup>
              <FormLabel>Tallas</FormLabel>
              {validSizes.map((size) => (
                <FormControlLabel
                  key={size}
                  control={<Checkbox checked={getValues('sizes').includes(size as ISize)} />}
                  label={size}
                  value={size}
                  onChange={handleChangeSize}
                />
              ))}
            </FormGroup>
            {!!errors.sizes && <FormHelperText error>{errors.sizes?.message}</FormHelperText>}
          </Grid>

          {/* Tags e imagenes */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Slug - URL"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              {...register('slug', {
                required: 'Este campo es requerido',
                validate: (value) => (value.trim().includes(' ') ? 'No puede tener espacios en blanco' : undefined)
              })}
              error={!!errors.slug}
              helperText={errors.slug?.message}
            />

            <TextField
              label="Etiquetas"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              helperText="Presiona [spacebar] para agregar"
              onChange={handleTagChange}
              value={tagInput}
              // onKeyUp={(e) => e.code === 'Space' && handleTagChange(e)}
            />

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                listStyle: 'none',
                p: 0,
                m: 0
              }}
              component="ul">
              {getValues('tags').map((tag) => {
                return (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => onDeleteTag(tag)}
                    color="primary"
                    size="small"
                    sx={{ ml: 1, mt: 1 }}
                  />
                );
              })}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" flexDirection="column">
              <FormLabel sx={{ mb: 1 }}>Imágenes</FormLabel>
              <Button
                color="secondary"
                fullWidth
                startIcon={<UploadOutlined />}
                sx={{ mb: 3 }}
                onClick={handleFileUpload}>
                Cargar imagen
              </Button>
              <input
                type="file"
                multiple
                accept="image/png, image/gif, image/jpeg"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileInputChange}
              />

              <Chip
                label="Es necesario al 2 imagenes"
                color="error"
                variant="outlined"
                sx={{ display: getValues('images').length < 2 ? 'flex' : 'none' }}
              />

              <Grid container spacing={2}>
                {getValues('images').map((img) => (
                  <Grid item xs={4} sm={3} key={img}>
                    <Card>
                      <CardMedia component="img" className="fadeIn" image={img} alt={img} />
                      <CardActions>
                        <Button fullWidth color="error" onClick={() => handleDeleteImage(img)}>
                          Borrar
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </form>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { slug = '' } = query;

  if (slug === 'new') {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _id, ...newProduct } = JSON.parse(JSON.stringify(new Product()));

    return {
      props: {
        product: { ...newProduct, images: ['img1.jpg', 'img2.jpg'] }
      }
    };
  }

  const product = await dbProducts.getProductBySlug(slug.toString());
  if (!product) {
    return {
      redirect: {
        destination: '/admin/products',
        permanent: false
      }
    };
  }

  return {
    props: {
      product
    }
  };
};

export default ProductAdminPage;
