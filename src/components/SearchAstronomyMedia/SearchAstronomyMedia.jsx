import { useState, useEffect, useCallback } from 'react';

import { NasaAPI } from "../../api/nasa";

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import s from './style.module.css';

function findVideo(array) {
  if (array && array.length > 0) {
    let videoStr = array[0];
    if (videoStr.endsWith(".mp4")) return videoStr;
  }
}

export const SearchAstronomyMedia = ( props ) => {

  const { searchAstronomy, ...rest } = props;

  const [currentAstronomyVideo, setCurrentAstronomyVideo] = useState();

  const fetchCollectionVideo = useCallback(async (url) => {
    const collectionVideos = await NasaAPI.fetchCollectionVideo(url);
    if (collectionVideos && collectionVideos.length > 0) {
      setCurrentAstronomyVideo(findVideo(collectionVideos));
    }
  }, [currentAstronomyVideo]);

  useEffect(() => {
    if (searchAstronomy) {
      fetchCollectionVideo(searchAstronomy.href)
    }
  }, [searchAstronomy])

  return (
    <Modal
      {...rest}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <h2 className={ s.title }>{ searchAstronomy.data[0].title }</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='p-0'>
        {
          searchAstronomy.links[0].href 
          ? 
            <img 
              src={ searchAstronomy.links[0].href  }  
              alt={ searchAstronomy.data[0].title } 
              className={ s.img }
            />
          : ""
        }
        <div className='pt-5 px-5 pb-3'>
          <p className={ s.date }>{ searchAstronomy.data[0].date_created.slice(0,10) }</p>
          <p className={ s.explanation }>{ searchAstronomy.data[0].description }</p>
          <p className={ s.copyright }> 
            {
              currentAstronomyVideo
              ? 
                <video 
                  className={'m-0 pt-3 pb-3'}
                  width={ '100%' }
                  height={ '350px' } 
                  controls 
                  src={ currentAstronomyVideo }>
                    Your browser does not support the video tag.
                </video>
              : ""
            }
          </p>
          <p className={ s.copyright }>
            { 
              searchAstronomy.data[0].keywords
              ? `Keywords: ${searchAstronomy.data[0].keywords}` 
              : ""
            }
          </p>
        </div>
        <div className='pb-5 px-5 text-center'>
          <Button className={ s.close } onClick={props.onHide}>Close</Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}
