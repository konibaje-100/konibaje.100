import React from 'react'
import Title from '../components/Title'
import NewsLetterBox from '../components/NewsLetterBox'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.abouts_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis quis eius perferendis perspiciatis. Dicta, officiis, praesentium illum suscipit harum voluptatum totam cupiditate alias fugiat quas assumenda tempore eos. Harum, sed.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit praesentium, saepe tempore expedita nulla laudantium architecto fugit aliquam aut, iure doloribus dolore quae non. Libero nulla modi ipsam unde expedita, laudantium, labore pariatur iusto tempora aliquid beatae architecto, iste aperiam.</p>
            <b className='text-grey-800'>Our Mission</b>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore eos porro, corporis commodi molestias dolor repudiandae eius at id earum autem distinctio, explicabo unde veritatis eum a veniam? Minus suscipit quidem blanditiis, aliquam delectus sed modi ex cupiditate laboriosam, voluptas aperiam cum harum, pariatur maxime!</p>
        </div>
      </div>
      <div className='text-xl py-4`'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Quality Assurance:</b>
            <p className=' text-gray-600'>We meticulously select and vet each product to ensure it meets our stringent quality standards.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Convenience:</b>
            <p>With our user friendly interface and hassle-free ordering process, shopping has never been easier.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Exceptional Customer Service:</b>
            <p>Our team of dedicated professionals are here to assist you, ensuring your satisfaction is our top priority.</p>
          </div>
      </div>

      <NewsLetterBox/>
    </div>
  )
}

export default About
