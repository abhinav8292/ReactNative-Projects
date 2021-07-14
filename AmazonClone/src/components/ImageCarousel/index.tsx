import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, FlatList, Image, useWindowDimensions} from 'react-native';
import styles from './styles';

interface Props {
  images?: string[];
}

const ImageCarousel: React.FC<Props> = ({images}) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const windowWidth = useWindowDimensions().width;

  const onImageChange = useCallback(({viewableItems}): void => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }, []);

  return (
    <View style={styles.root}>
      <FlatList
        data={images}
        renderItem={({item}) => (
          <Image
            key={activeIndex}
            style={styles.image}
            source={{width: windowWidth - 40, height: 250, uri: item}}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={windowWidth - 20}
        snapToAlignment={'center'}
        decelerationRate={'fast'}
        viewabilityConfig={{
          viewAreaCoveragePercentThreshold: 50,
        }}
        onViewableItemsChanged={onImageChange}
      />
      <View style={styles.dots}>
        {images.map((image, index) => (
          <View
            style={[
              styles.dot,
              {backgroundColor: index === activeIndex ? '#c9c9c9' : '#ededed'},
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default ImageCarousel;
