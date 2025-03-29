import { Box, Button, Card, Flex, Image } from "@chakra-ui/react";
import Link from "next/link";

export interface ICardInfos {
  title: string;
  thumbnail: string | undefined;
  path: string;
}

interface IHeaderProps {
  cards: ICardInfos[];
  defaultThumbnail: string;
}

export default function Carousel({ defaultThumbnail, cards }: IHeaderProps) {
  return (
    <Box p={4}>
      <Box
        color={{ base: "#000000", _dark: "#FFFFFF" }}
        p={4}
        bg={{ base: "#f1f0f0", _dark: "#131313" }}
        mx="auto"
        overflowX="auto"
      >
        <Flex direction="row" gap={4} minW="max-content">
          {cards.map((card) => {
            return (
              <Card.Root width={250} key={card.title}>
                <Image
                  height={200}
                  width={250}
                  src={card.thumbnail ?? defaultThumbnail}
                  alt={card.title}
                />
                <Card.Body gap="2">
                  <Card.Title mt="2" textAlign="center">
                    {card.title}
                  </Card.Title>
                </Card.Body>
                <Card.Footer justifyContent="center">
                  <Link href={card.path}>
                    <Button variant="outline">Lire</Button>
                  </Link>
                </Card.Footer>
              </Card.Root>
            );
          })}
        </Flex>
      </Box>
    </Box>
  );
}
