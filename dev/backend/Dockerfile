FROM public.ecr.aws/lambda/python:3.11

COPY ./ ./

ENV ENV=production

RUN pip install -r ./requirements.txt

CMD ["main.handler"]