from jinja2 import Environment, FileSystemLoader
from litestar import Litestar, Request, Response, get, post
from litestar.exceptions import HTTPException
from litestar.response import Redirect
from litestar.status_codes import HTTP_500_INTERNAL_SERVER_ERROR
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from env import players
from ttt.db import tick  #, init_db
from ttt.orm import Match
from ttt.utils import schedule_from_players, standings_from_results

# Set up Jinja2 environment
template_loader = FileSystemLoader("templates")
jinja_env = Environment(loader=template_loader)

# Sample data for world standings
standings = [
    {"rank": 1, "name": "Fan Zhendong", "country": "China", "points": 15000},
    {"rank": 2, "name": "Ma Long", "country": "China", "points": 14500},
    {"rank": 3, "name": "Xu Xin", "country": "China", "points": 14000},
    {"rank": 4, "name": "Tomokazu Harimoto", "country": "Japan", "points": 13500},
    {"rank": 5, "name": "Hugo Calderano", "country": "Brazil", "points": 13000},
    # Add more players as needed
]

# init_db()
# Create a SQLite database in memory for demonstration purposes
engine = create_engine("sqlite:///ttt.db")
Session = sessionmaker(bind=engine)
player_schedule = schedule_from_players(players)


def app_exception_handler(request: Request, exc: HTTPException) -> Response:
    return Response(
        content={
            "error": "server error",
            "path": request.url.path,
            "detail": exc.detail,
            "status_code": 500,
        },
        status_code=500,
    )


# Define a route
@get("/", exception_handlers={HTTP_500_INTERNAL_SERVER_ERROR: app_exception_handler})
async def index() -> Response:
    template = jinja_env.get_template("index.html")
    html_content = template.render(
        title="Office Table Tennis League",
        heading="Office Table Tennis League",
        message="Infos",
        standings=standings,
    )

    tick(Session, "index")
    return Response(content=html_content, media_type="text/html")


@get("/standings")
async def current_standings() -> Response:
    template = jinja_env.get_template("standings.html")

    with Session() as session:
        all_matches = session.query(Match).all()

    tick(Session, "current_standings")
    standings = standings_from_results(all_matches, players)

    html_content = template.render(
        title="Current standings",
        heading="",
        message="",
        standings=standings,
    )
    return Response(content=html_content, media_type="text/html")


# Endpoint for schedule
@get(
    "/schedule",
    exception_handlers={HTTP_500_INTERNAL_SERVER_ERROR: app_exception_handler},
)
async def schedule() -> Response:
    template = jinja_env.get_template("schedule.html")

    with Session() as session:
        results = session.query(Match).all()

    tick(Session, "schedule")

    schedule = [i.to_dict() for i in results]

    for round in schedule:
        print(f"Round: {round}")
        for match in round:
            print(f"match: {match}")

    html_content = template.render(
        title="Schedule",
        heading="Schedule",
        message="",
        schedule=schedule,
    )

    return Response(content=html_content, media_type="text/html")


@get("/result/{match_id: str}", exception_handlers={HTTP_500_INTERNAL_SERVER_ERROR: app_exception_handler})
async def result(match_id: str) -> Response:
    template = jinja_env.get_template("result.html")

    with Session() as session:
        print(match_id)
        print(session.query(Match).filter(Match.id == match_id).all())
        result = session.query(Match).filter(Match.id == match_id).all()[0]
    tick(Session, "result")

    score = [result.score0, result.score1]
    players = [result.player0, result.player1, result.player2, result.player3]

    html_content = template.render(
        title="Result",
        heading="Submit result",
        message=f"Result for Match ID {match_id}",
        match_id=match_id,
        score=score,
        players=players,
    )
    return Response(content=html_content, media_type="text/html")


@post("/enter_result/{match_id: str}", exception_handlers={HTTP_500_INTERNAL_SERVER_ERROR: app_exception_handler})
async def enter_result(match_id: str, request: Request) -> any:
    results = await request.form()

    score0, score1 = results["result0"], results["result1"]

    try:
        score0 = int(score0)
        score1 = int(score1)
    except Exception:
        return "No valid integers provided."

    if score0 + score1 not in [0, 4]:
        return "Scores don't add up to 4. Enter 4 sets please."

    with Session() as session:
        session.query(Match).filter(Match.id == match_id).update({"score0": score0, "score1": score1})
        session.commit()
    tick(Session, "enter_result")

    return Redirect(path="/schedule")


@get("/rules", exception_handlers={HTTP_500_INTERNAL_SERVER_ERROR: app_exception_handler})
async def rules() -> Response:
    template = jinja_env.get_template("rules.html")
    html_content = template.render(
        title="Short Table Tennis Rules",
        heading="",
        message="",
        standings=standings,
    )

    tick(Session, "rules")
    return Response(content=html_content, media_type="text/html")


# Create the Litestar app
app = Litestar(route_handlers=[index, current_standings, schedule, result, enter_result, rules])
